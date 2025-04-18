import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance, FastifySchema, RouteGenericInterface } from "fastify";

const TDate = Type.Unsafe<Date>({ type: "string", format: "date-time" });

const Params = Type.Object({ date: TDate });
const Query = Type.Object({ date: TDate });
const Body = Type.Object({ date: TDate });
const Reply = Type.Object({ 200: Type.Object({ date: TDate }) });

export interface DateRouteInterface extends RouteGenericInterface {
    Params: Static<typeof Params>;
    Querystring: Static<typeof Query>;
    Body: Static<typeof Body>;
    Reply: Static<typeof Reply>;
}

const DateSchema: FastifySchema = {
    summary: "Get the current date",

    // comment this 3 lines to stop the error to occur
    params: Params,
    querystring: Query,
    body: Body,
    //

    response: Reply.properties
};

export async function routes(fastify: FastifyInstance, _options: any) {
    fastify.post<DateRouteInterface>("/date", { schema: DateSchema }, async (request, reply) => {
        const { date } = request.body;

        console.log("Date from body:", date);

        return reply.status(200).send({ date: new Date() });
    });
}
