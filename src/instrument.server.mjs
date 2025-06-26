import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { createAddHookMessageChannel } from "import-in-the-middle";
import { register } from "module";

const { registerOptions, waitForAllMessagesAcknowledged } =
  createAddHookMessageChannel();
  register(
    "import-in-the-middle/hook.mjs",
    import.meta.url,
    registerOptions
  );

const sdk = new NodeSDK({
  serviceName: "delivery-saas",
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

await waitForAllMessagesAcknowledged();