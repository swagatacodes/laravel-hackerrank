<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Testcase;

class Problem extends Model
{
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function testcases(): HasMany
    {
        return $this->hasMany(Testcase::class);
    }

    use HasFactory;
    //public $incrementing = false;
    public $timestamps = false;
}