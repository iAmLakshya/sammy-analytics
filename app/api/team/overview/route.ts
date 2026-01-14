import {
  RouteContext,
  wrapRouteHandler,
} from "@/shared/utils/server/wrap-route-handler";
import { NextRequest, NextResponse } from "next/server";
import { getTeamOverview } from "./service";

export const GET = async (request: NextRequest, context: RouteContext) => {
  return wrapRouteHandler(request, context, (deps) => async (req, ctx) => {
    const result = await getTeamOverview(deps)();
    if ("statusCode" in result) {
      throw result;
    }
    return NextResponse.json(result);
  });
};
