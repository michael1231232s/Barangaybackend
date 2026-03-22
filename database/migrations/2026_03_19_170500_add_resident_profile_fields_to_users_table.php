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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone_number', 50)->nullable()->after('email');
            $table->string('address_line', 255)->nullable()->after('phone_number');
            $table->string('purok', 100)->nullable()->after('address_line');
            $table->string('barangay', 150)->nullable()->after('purok');
            $table->string('city', 150)->nullable()->after('barangay');
            $table->string('province', 150)->nullable()->after('city');
            $table->date('birthdate')->nullable()->after('province');
            $table->string('gender', 30)->nullable()->after('birthdate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone_number',
                'address_line',
                'purok',
                'barangay',
                'city',
                'province',
                'birthdate',
                'gender',
            ]);
        });
    }
};
