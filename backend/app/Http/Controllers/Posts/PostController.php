<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\UserPostInteractions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    /**
     * Display a listing of the posts.
     */
    public function index(Request $request)
    {
        $query = Post::query();

        $query->with(['users'])
              ->withCount([
                  "interactions as likes_count" => function ($query) {
                      $query->where("liked", 1);
                  },
                  "interactions as favorite_count" => function ($query) {
                      $query->where("favorite", 1);
                  }
              ])
              ->withAvg("interactions", "rating");



        if ($request->has('slug')) {
            $query->where('slug', $request->input('slug'));
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        if ($request->has('id')) {
            $query->where("id", $request->input("id"));
        }

        if ($request->has('slug')) {
            $query->where('slug', $request->input('slug'));
            $posts = $query->first();

            return response()->json($posts);
        }

        if ($request->has("search")) {
            $search = $request->input("search");
            $query->where(function ($q) use ($search) {
                $q->where("title", "like", "%$search%")
                  ->orWhere("content", "like", "%$search%");
            });
        }

        if ($request->has('category_id')) {
            $categoryId = $request->input('category_id');
            $query->whereRelation('categories','id',$categoryId);
        }


        if ($request->has('limit')) {
            $limit = $request->input('limit');
            $query->limit($limit);
        }

        $orderDirection = $request->input('sort_order', 'desc');
        if ($request->has("sort_by")) {
            $query->orderBy($request->input("sort_by"), $orderDirection);
        } else {
            $query->orderBy("id", $orderDirection);
        }

        $posts = $query->get();

        return response()->json($posts);
    }

    public function usersPosts(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;

        $posts = Post::where('user_id', $userId)->get();

        return response()->json($posts);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json(["message" => "Form for creating a new posts"]);
    }

    /**
     * Store a newly created posts in storage.
     */
    public function store(Request $request)
    {

        $user = $request->user();
        $userId = $user->id;


        $request->validate([
            "title" => "required|string|max:255",
            "shortDescription" => "required|string",
            "content" => "required|string",
            "slug" => "required|string",
            'image' => 'nullable|string', //
            'categoryIds' => 'array',
            'categoryIds.*' => 'exists:categories,id'
        ]);

        // $data = $request->all();
        $data = $request->only(['title', 'shortDescription', 'content', 'slug', 'image']);
        /*
        if($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('post_images', 'public');
        } else {
            $data['image'] = null;
        }
        */

        $post = new Post($data);
        $post->user_id = $userId;
        $post->save();

        if ($request->has('categoryIds')) {
            $post->categories()->attach($request->input('categoryIds'));
        }

        return response()->json($post, 201);
    }

    public function uploadPostImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        if($request->hasFile('image')) {
            $path = $request->file('image')->store('post_images', 'public');
            return response()->json(['path' => $path], 200);
        }

        return response()->json(['message' => 'no image uploaded'], 400);

    }

    public function uploadImageUrl(Request $request)
    {
        $request->validate([
            'image' => 'required|string'
        ]);
    }


    /**
     * Display the specified posts.
     */
    public function show(Post $post)
    {
        return response()->json($post);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        return response()->json($post);
    }

    /**
     * Update the specified posts in storage.
     */
    public function update(Request $request, Post $post)
{
    $request->validate([
        "title" => "required|string|max:255",
        "shortDescription" => "required|string",
        "content" => "required|string",
        "image" => "required|string",
        "user_id" => "required|exists:users,id",
    ]);

    // Update the post
    $post->update($request->all());
    return response()->json($post);
}


    /**
     * Remove the specified posts from storage.
     */
    public function destroy(Post $post)
    {
        $post->delete();
        return response()->json(null, 204);
    }
}
