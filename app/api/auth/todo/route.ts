import { prisma } from "@/utils/auth";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../utils/auth";



interface TodoCreateInput {
    title: string;
    description: string;
    completed?: boolean;
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const getTodos = await prisma.todo.findMany()
        if (!getTodos) {
            return NextResponse.json({ error: "No todos found" }, { status: 404 });
        }
        return NextResponse.json({ todos: getTodos }, { status: 200 });
    } catch (error) {
        console.error("Error fetching todos:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { title, description } = await req.json();
        if (!title || !description) {
            return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
        }
        const newTodo = await prisma.todo.create({
            data: {
                title,
                description,
                user: { connect: { id: Number(session?.user?.id) } },
            },
        });
        return NextResponse.json({ todo: newTodo }, { status: 201 });
    } catch (error) {
        console.error("Error adding todo:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}