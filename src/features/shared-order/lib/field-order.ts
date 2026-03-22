import type { SellerOrderConfig } from "@/features/shared-order/types/order.types";

export const BUILT_IN_FIELD_ORDER_IDS = [
  "customerName",
  "productName",
  "quantity",
  "phoneNumber",
  "address",
  "note",
] as const;

export type BuiltInFieldId = (typeof BUILT_IN_FIELD_ORDER_IDS)[number];

export type ResolvedBuiltInField = {
  id: BuiltInFieldId;
  kind: "builtIn";
  label: string;
};

export type ResolvedCustomField = {
  id: string;
  kind: "custom";
  fieldId: string;
  label: string;
  placeholder: string;
  required: boolean;
  inputType: "text" | "textarea";
};

export type ResolvedFieldDefinition = ResolvedBuiltInField | ResolvedCustomField;

export function getFieldLabelById(config: SellerOrderConfig, fieldId: string) {
  switch (fieldId) {
    case "customerName":
      return "Nama";
    case "productName":
      return "Nama produk";
    case "quantity":
      return "Jumlah";
    case "phoneNumber":
      return "Nomor HP";
    case "address":
      return "Alamat";
    case "note":
      return "Catatan";
    default: {
      const customField = config.customFields.find((field) => `custom:${field.id}` === fieldId);
      return customField?.label ?? fieldId;
    }
  }
}

function getVisibleFieldIds(config: SellerOrderConfig) {
  const builtIn = [
    "customerName",
    "productName",
    "quantity",
    ...(config.showPhoneNumber ? ["phoneNumber"] : []),
    ...(config.showAddress ? ["address"] : []),
    ...(config.showNote ? ["note"] : []),
  ];

  const custom = config.customFields.map((field) => `custom:${field.id}`);

  return [...builtIn, ...custom];
}

export function resolveOrderedFieldIds(config: SellerOrderConfig) {
  const visible = getVisibleFieldIds(config);
  const visibleSet = new Set(visible);

  const configured = config.fieldOrder.filter((fieldId) => visibleSet.has(fieldId));
  const uniqueConfigured: string[] = [];
  const configuredSet = new Set<string>();

  for (const fieldId of configured) {
    if (configuredSet.has(fieldId)) {
      continue;
    }

    configuredSet.add(fieldId);
    uniqueConfigured.push(fieldId);
  }

  const remaining = visible.filter((fieldId) => !configuredSet.has(fieldId));
  return [...uniqueConfigured, ...remaining];
}

export function resolveOrderedFields(config: SellerOrderConfig): ResolvedFieldDefinition[] {
  return resolveOrderedFieldIds(config)
    .map((fieldId): ResolvedFieldDefinition | null => {
      if (fieldId.startsWith("custom:")) {
        const customId = fieldId.replace("custom:", "");
        const customField = config.customFields.find((field) => field.id === customId);

        if (!customField) {
          return null;
        }

        return {
          id: fieldId,
          kind: "custom",
          fieldId: customField.id,
          inputType: customField.type,
          label: customField.label,
          placeholder: customField.placeholder,
          required: customField.required,
        };
      }

      if (!BUILT_IN_FIELD_ORDER_IDS.includes(fieldId as BuiltInFieldId)) {
        return null;
      }

      return {
        id: fieldId as BuiltInFieldId,
        kind: "builtIn",
        label: getFieldLabelById(config, fieldId),
      };
    })
    .filter((field): field is ResolvedFieldDefinition => Boolean(field));
}
