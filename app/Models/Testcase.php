<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Problem;

class Testcase extends Model
{
    protected $table = 'testcase';
    public function problem(): BelongsTo
    {
        return $this->belongsTo(Problem::class);
    }

    use HasFactory;
    //public $incrementing = false;
    public $timestamps = false;
}