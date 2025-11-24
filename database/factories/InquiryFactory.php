<?php

namespace Database\Factories;

use App\Models\Artwork;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Inquiry>
 */
class InquiryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->email(),
            'company' => fake()->optional()->company(),
            'message' => fake()->optional()->paragraph(),
            'artwork_ids' => [Artwork::factory()->create()->id],
            'status' => 'pending_verification',
            'verification_token' => fake()->sha256(),
        ];
    }
}
