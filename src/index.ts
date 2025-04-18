import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { TypeBoxTypeProvider, TypeBoxValidatorCompiler } from "@fastify/type-provider-typebox";
import fastify from "fastify";
import { routes } from "./routes";

const port = 3001;

async function main() {
    const app = fastify().withTypeProvider<TypeBoxTypeProvider>();
    //registerFormats();
    app.setValidatorCompiler(TypeBoxValidatorCompiler);

    await app.register(fastifySwagger, {
        openapi: {
            openapi: "3.1.0",
            info: {
                title: `Test API`,
                version: "0.0.0-undefined"
            },
            components: {
                securitySchemes: {
                    Bearer: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT"
                    }
                }
            }
        }
    });

    await app.register(fastifySwaggerUi, {
        routePrefix: "/docs",
        uiConfig: {
            deepLinking: false
        },
        uiHooks: {
            onRequest: function (_request: any, _reply: any, next: () => void) {
                next();
            },
            preHandler: function (_request: any, _reply: any, next: () => void) {
                next();
            }
        },
        staticCSP: true,
        transformStaticCSP: (header: any) => header,
        transformSpecification: (swaggerObject: any, _request: any, _reply: any) => {
            return swaggerObject;
        },
        transformSpecificationClone: true
    });

    app.register(routes);

    app.addHook("onListen", () => {
        console.log("Server is running on port", port);
    });

    await app.ready();
    app.swagger();

    try {
        await app.listen({
            port: port,
            host: "0.0.0.0"
        });
    } catch (error) {
        console.error("Error while starting the server");
        console.error(error);
        process.exit(1);
    }
}

main();
