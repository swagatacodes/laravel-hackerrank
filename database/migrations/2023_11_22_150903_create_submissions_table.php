<?php

use App\Models\Problem;
use App\Models\Testcase;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignIdFor(User::class)->constrained();
            $table->foreignIdFor(Problem::class)->constrained();
            $table->integer('language_id');
            $table->enum('status', ['Pending', 'Success', 'Failed']);
            $table->foreignIdFor(Testcase::class)->constrained();
            $table->text('stdout')->nullable();
            $table->text('stderr')->nullable();
            $table->text('submitted_code');
            $table->float('time',10,2);
            $table->float('memory',10,2);
            $table->string('token',50);
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
