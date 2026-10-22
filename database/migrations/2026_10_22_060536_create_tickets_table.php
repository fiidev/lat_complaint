<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('complaint_id')->unique()->contrained()->cascadeOnDelete();
            $table->foreignId('assigned_to')->contrained('users')->cascadeOnDelete();
            $table->foreignId('created_by')->contrained('users')->cascadeOnDelete();
            $table->string('ticket_number');
            $table->string('priority');
            $table->enum('status', ['open', 'in_progress', 'resolved'])->deafult('open');
            $table->text('resolution_notes')->nullable();
            $table->date('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
