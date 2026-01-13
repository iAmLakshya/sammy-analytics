import { NextRequest, NextResponse } from "next/server"
import { wrapRouteHandler, RouteContext } from "@/shared/utils/server/wrap-route-handler"
import { getReviewActivity } from "./service"

export const GET = async (request: NextRequest, context: RouteContext) => {
  return wrapRouteHandler(request, context, (deps) => async (req, ctx) => {
    const result = await getReviewActivity(deps)()
    if ("statusCode" in result) {
        throw result
    }
    return NextResponse.json(result)
  })
}
