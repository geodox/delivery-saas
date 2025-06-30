import { SimpleSpanProcessor, WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";

const provider = new WebTracerProvider({
  resource: resourceFromAttributes({
    "service.name": "delivery-saas",
  }),
  spanProcessors: [
    new SimpleSpanProcessor(
      new OTLPTraceExporter({ url: "http://localhost:3000/jaeger" })
    ),
  ],
});

provider.register();

registerInstrumentations({
  instrumentations: [
    new DocumentLoadInstrumentation(),
    new FetchInstrumentation(),
  ],
});