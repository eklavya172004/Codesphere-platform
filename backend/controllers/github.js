const {  GitHub } = await import("arctic");

export const github = new GitHub(
    process.env.Client_ID,
    process.env.Client_secrets,
)