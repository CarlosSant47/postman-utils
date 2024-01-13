<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Lumen\Routing\Controller as BaseController;

class PostmanUtilsController extends BaseController
{

    /**
     * Retrieves a file from the request.
     *
     * @param Request $request The HTTP request object.
     * @return mixed The file retrieved from the request.
     */
    public function getFile(Request $request)
    {
        $path = $request->input('path');
        if (empty($path)) {
            return response()->json([
                'error' => 'Path is required'
            ], 400);
        }

        if (!file_exists($path)) {
            return response()->json([
                'error' => 'File not found'
            ], 404);
        }

        return [
            'content' => base64_encode(file_get_contents($path)),
            'fileName' => basename($path)
        ];
    }
}
