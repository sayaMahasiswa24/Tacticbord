<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Features Configuration
    |--------------------------------------------------------------------------
    |
    | Centralized feature flags for controlling experimental or staging modules.
    |
    */

    'ai_assistant_enabled' => (bool) env('AI_ASSISTANT_ENABLED', false),
];
