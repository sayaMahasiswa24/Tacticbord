<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LandingPageController extends Controller
{
    /**
     * Display the tactical board landing page.
     */
    public function index(): Response
    {
        return Inertia::render('Landing/Index');
    }
}
