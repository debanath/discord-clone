import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
    params: {
        serverId: string;
    };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
    const profile = await currentProfile();

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile?.id,
                },
            },
        },
        include: {
            channels: {
                where: {
                    name: "general",
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    const initialChannel = server?.channels[0];

    if (initialChannel?.name !== "general") {
        return null;
    }

    if (!profile) {
        return redirectToSignIn();
    }
    return redirect(
        `/servers/${params.serverId}/channels/${initialChannel?.id}`
    );
};

export default ServerIdPage;
