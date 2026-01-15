import {
  RouteContext,
  wrapRouteHandler,
} from "@/shared/utils/server/wrap-route-handler";
import { NextRequest, NextResponse } from "next/server";
import { processTask } from "./service";
import type { ProcessAction } from "@/features/lsta-automation/types";

export const POST = async (request: NextRequest, context: RouteContext) => {
  return wrapRouteHandler(request, context, (deps) => async (req) => {
    const body = await req.json();
    const { taskId, action, failureStep } = body as {
      taskId: string;
      action: ProcessAction;
      failureStep?: string;
    };

    const result = await processTask(deps)({ taskId, action, failureStep });

    if ("statusCode" in result) {
      throw result;
    }

    return NextResponse.json(result);
  });
};
