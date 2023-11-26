<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class Categoryseeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create(['id'=>'String']);
        Category::create(['id'=>'Array']);
        Category::create(['id'=>'Linked List']);
        Category::create(['id'=>'Tree']);
        Category::create(['id'=>'Graph']);
        Category::create(['id'=>'Dynamic Programming']);
    }
}
