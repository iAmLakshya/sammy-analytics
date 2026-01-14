import { NextRequest, NextResponse } from "next/server";
import { wrapRouteHandler, RouteContext } from "@/shared/utils/server/wrap-route-handler";
import { retryLstaTask } from "./service";

export const POST = async (request: NextRequest, context: RouteContext) => {
  return wrapRouteHandler(request, context, (deps) => async (req, ctx) => {
    const params = await ctx.params;
    const taskId = params.taskId;

    const result = await retryLstaTask(deps)(taskId);
    if ("statusCode" in result) {
      throw result;
    }
    return NextResponse.json(result);
  });
};
