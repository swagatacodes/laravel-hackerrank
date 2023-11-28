<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Problem;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/category', function () {
    return Inertia::render('Category',['cats'=>Category::all()]);
})->middleware(['auth', 'verified'])->name('category');
Route::get('/question_list', function (Request $request) {
    $category_id = $request->query('category_id');
    return Inertia::render('Question_list', ['problems'=> Problem::where('category_id',$category_id)->get()]);
})->middleware(['auth', 'verified'])->name('question_list');
Route::get('/submission_list', function (Request $request) {
    $problem_id = $request->query('problem_id');
    $user_id = Auth::id();
    $submissions = Submission::where("problem_id", $problem_id)->where("user_id", $user_id)->orderBy('id', 'desc')->get();
    $problem=Problem::where('id',$problem_id)->first();
    Log::info("submissions are %s", [$submissions]);
    return Inertia::render('Submission_list', ['submissions'=> $submissions,'problem'=>$problem]);
})->middleware(['auth', 'verified'])->name('submission_list');
Route::get('/question_code', function (Request $request) {
    $q_id = $request->query('qid');
    return Inertia::render('Question_code',['question_data'=> Problem::find($q_id)]);
})->middleware(['auth', 'verified'])->name('question_code');

Route::get('/question_code/best_submission',function (Request $request){
    $p_id=$request->query('pid');
    Log::info("pid");
    Log::info($p_id);
    $best_time_complexity=Submission::where('problem_id',$p_id)->where('status','Success')->orderBy('time')->first();
    Log::info("best submission");
    Log::info($best_time_complexity);

    $best_space_submission=Submission::where('problem_id',$p_id)->where('status','Success')->orderBy('memory')->first();
    Log::info($best_space_submission);
    return Inertia::render('Best_submission',['pid'=>$p_id,'best_time_submission'=>$best_time_complexity,'best_space_submission'=>$best_space_submission]);
})->middleware(['auth', 'verified'])->name('best_submission');




Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
