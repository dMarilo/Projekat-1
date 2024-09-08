<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class UserPostLike extends Model
{
    use HasFactory;

    // Specify the table associated with the model
    protected $table = 'user_post_likes';

    // Specify the fillable attributes
    protected $fillable = ['user_id', 'post_slug'];
}
