<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComplaintCategory extends Model
{
    protected $guarded = ['id'];

    public function complaints()
    {
        return $this->hasMany(Complaint::class, 'category_id');
    }
}
