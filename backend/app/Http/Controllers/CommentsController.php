<?php

namespace App\Http\Controllers;

use App\Models\Comments;
use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentsController extends Controller
{
    
    public function getComment(){
        $comments = Comment::with('user')->get();
        return response()->json($comments, 200);
    }

    public function getCommentById($id){
        $comment = Comment::with('user')->find($id);
        if (is_null($comment)) {
            return response()->json(['message' => "Comment Not Found"], 404);
        }
        return response()->json($comment, 200);
    }

    public function addComment(Request $request, User $user){
        $user = $request->user();
        $userId = $user->id;

        $postSlug = $request->input('post_slug');
        $post = Post::where('slug', $postSlug)->first();
        if (!$post) {
            return response()->json(['message' => 'Post Not Found'], 404);
        }

        $comment = new Comment();
        $comment->content = $request->input('content');
        $comment->post_id = $post->id;
        $comment->user_id = $userId;

        $comment->save();

        return response()->json(['message' => 'Commented successfully']);
    }

    public function updateComment(Request $request, $id){
        $comment = Comments::find($id);
        if(is_null($comment)){
            return response()-> json(['message'=> 'Comment Not Found'], 404);
        }
        $comment->update($request->all());
        return response($comment, 200);
    }

    public function deleteComment(Request $request, $id){
        $comment = Comment::find($id);
        if(is_null($comment)){
            return response()-> json(['message'=> 'Comment Not Found'], 404);
        }
        $comment->delete();
        return response()->json(null, 204);
    }

    public function getCommentsByPost(Request $request)
    {
        $postSlug = $request->query('post_slug');
        $orderBy = $request->query('prder_by', 'created_at');

        if(is_null($postSlug)){
            return response()->json(['message'=> 'Post slug required'], 400);
        }

        $post = Post::where('slug', $postSlug)->first();
        if (!$post) {
            return response()->json(['message' => 'Post Not Found'], 404);
        }

        $comments = Comment::with('user')
                            ->where('post_id', $post->id)
                            ->orderByDesc($orderBy)
                            ->get();

        return response()->json($comments, 200);
    }

}
