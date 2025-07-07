export function GET(
    req: Request,
    { params }: { params: { userId: string } }
): Response {
    return Response.json({
        hello: "Hello, this is a user route!",
        userId: params.userId
    });
}