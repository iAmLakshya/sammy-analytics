import { parseDemoCsv } from "@/features/lsta-automation/utils/csv-parser";
import {
  RouteContext,
  wrapRouteHandler,
} from "@/shared/utils/server/wrap-route-handler";
import { NextRequest, NextResponse } from "next/server";
import { createDemoBatch } from "./service";

export const POST = async (request: NextRequest, context: RouteContext) => {
  return wrapRouteHandler(request, context, (deps) => async (req) => {
    const body = await req.json();
    const { csvContent } = body as { csvContent: string };

    const rows = parseDemoCsv(csvContent);
    const result = await createDemoBatch(deps)({ rows });

    if ("statusCode" in result) {
      throw result;
    }

    return NextResponse.json(result);
  });
};
