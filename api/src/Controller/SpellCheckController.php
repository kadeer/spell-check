<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class SpellCheckController extends AbstractController
{
    private HttpClientInterface $client;

    public function __construct(HttpClientInterface $client)
    {

        $this->client = $client;
    }

    #[Route('/spell/check', name: 'app_spell_check', methods: ['POST'])]
    public function index(Request $request): JsonResponse
    {
        $body = [
            'lang' => $request->request->get('lang'),
            'text' => $request->request->get('text')
        ];

        $response = $this->client->request('POST', 'http://35.197.120.214:5000/api/v1/spell', [
            'body' => $body
        ]);

        return $this->json($response->toArray());
    }
}
