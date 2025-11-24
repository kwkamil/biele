<?php

namespace App\Listeners;

use App\Models\ActionLog;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Events\Dispatcher;

class LogAuthenticationEvents
{
    public function handleLogin(Login $event): void
    {
        ActionLog::log(
            action: 'user_login',
            subject: $event->user,
            details: [
                'guard' => $event->guard,
                'remember' => request()->boolean('remember'),
            ],
            userId: $event->user->id
        );
    }

    public function handleLogout(Logout $event): void
    {
        ActionLog::log(
            action: 'user_logout',
            subject: $event->user,
            details: [
                'guard' => $event->guard,
            ],
            userId: $event->user->id
        );
    }

    public function handleRegistered(Registered $event): void
    {
        ActionLog::log(
            action: 'user_registered',
            subject: $event->user,
            details: [
                'email' => $event->user->email,
                'name' => $event->user->name,
                'role' => $event->user->role ?? 'user',
            ],
            userId: $event->user->id
        );
    }

    public function handleVerified(Verified $event): void
    {
        ActionLog::log(
            action: 'email_verified',
            subject: $event->user,
            userId: $event->user->id
        );
    }

    public function handlePasswordReset(PasswordReset $event): void
    {
        ActionLog::log(
            action: 'password_reset',
            subject: $event->user,
            userId: $event->user->id
        );
    }

    public function handleFailed(Failed $event): void
    {
        ActionLog::log(
            action: 'login_failed',
            details: [
                'email' => request()->input('email'),
                'guard' => $event->guard,
            ],
            userId: null
        );
    }

    public function subscribe(Dispatcher $events): array
    {
        return [
            Login::class => 'handleLogin',
            Logout::class => 'handleLogout',
            Registered::class => 'handleRegistered',
            Verified::class => 'handleVerified',
            PasswordReset::class => 'handlePasswordReset',
            Failed::class => 'handleFailed',
        ];
    }
}
