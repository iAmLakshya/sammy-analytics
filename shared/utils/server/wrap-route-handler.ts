/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { ServiceError, UnknownServerError } from "./errors";

export interface CoreDependencies {
  supabase: any; // Using any for now as we don't have the typed client yet
  organisationId: string;
  profile: any;
  user: any;
}

// Route parameters type (for dynamic routes)
export interface RouteContext {
  params: Promise<Record<string, string>>;
}

export type RouteHandlerFactory = (
  dependencies: CoreDependencies
) => (
  request: NextRequest,
  context: RouteContext
) => Promise<NextResponse | ServiceError>;

export async function wrapRouteHandler(
  request: NextRequest,
  context: RouteContext,
  handlerFactory: RouteHandlerFactory
): Promise<NextResponse> {
  try {
    const dependencies: CoreDependencies = {
      supabase: {},
      organisationId: "mock-org-id",
      profile: { id: "mock-profile-id" },
      user: { id: "mock-user-id" },
    };

    const handler = handlerFactory(dependencies);
    const result = await handler(request, context);

    if (result instanceof ServiceError) {
      return result.toResponse();
    }

    return result;
  } catch (error) {
    console.error("Unhandled route error:", error);
    if (error instanceof ServiceError) {
      return error.toResponse();
    }
    return new UnknownServerError(
      error instanceof Error ? error.message : "Unknown error"
    ).toResponse();
  }
}
