import { NextRequest, NextResponse } from "next/server";
import { wrapRouteHandler, RouteContext } from "@/shared/utils/server/wrap-route-handler";
import { getLstaTaskList } from "./service";

export const GET = async (request: NextRequest, context: RouteContext) => {
  return wrapRouteHandler(request, context, (deps) => async (req) => {
    const searchParams = req.nextUrl.searchParams;
    const batchId = searchParams.get("batch_id") ?? undefined;
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const size = parseInt(searchParams.get("size") ?? "20", 10);

    const result = await getLstaTaskList(deps)({ batchId, page, size });
    if ("statusCode" in result) {
      throw result;
    }
    return NextResponse.json(result);
  });
};
