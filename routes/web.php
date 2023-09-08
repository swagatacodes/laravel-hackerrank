<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Problem;
use Illuminate\Http\Request;

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
Route::get('/question_code', function (Request $request) {
    $q_id = $request->query('qid');
    return Inertia::render('Question_code',['question_data'=> Problem::find($q_id)]);
})->middleware(['auth', 'verified'])->name('question_code');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
