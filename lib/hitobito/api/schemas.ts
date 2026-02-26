import { z } from "zod";

const PersonAttributesSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  nickname: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  birthday: z.string().nullable().optional(),
  gender: z.enum(["m", "w"]).nullable().optional(),
  address: z.string().nullable().optional(),
  zip_code: z.coerce.string().nullable().optional(),
  town: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  primary_group_id: z.coerce.number().nullable().optional(),
  picture: z.string().nullable().optional(),
});

const GroupAttributesSchema = z.object({
  name: z.string(),
  short_name: z.string().nullable().optional(),
  type: z.string().optional(),
  parent_id: z.coerce.number().nullable().optional(),
  layer_group_id: z.coerce.number().nullable().optional(),
  email: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  zip_code: z.coerce.string().nullable().optional(),
  town: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
});

const EventAttributesSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  motto: z.string().nullable().optional(),
  cost: z.string().nullable().optional(),
  maximum_participants: z.coerce.number().nullable().optional(),
  participant_count: z.coerce.number().nullable().optional(),
  location: z.string().nullable().optional(),
  application_opening_at: z.string().nullable().optional(),
  application_closing_at: z.string().nullable().optional(),
  application_conditions: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  group_ids: z.array(z.coerce.number()).optional(),
});

const EventDateAttributesSchema = z.object({
  label: z.string().nullable().optional(),
  start_at: z.string(),
  finish_at: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
});

const RelationshipField = z
  .object({
    data: z
      .array(z.object({ id: z.coerce.number(), type: z.string() }))
      .optional(),
  })
  .passthrough();

const EventRelationshipSchema = z
  .object({
    dates: RelationshipField.optional(),
    groups: RelationshipField.optional(),
  })
  .passthrough();

const IncludedResourceSchema = z.object({
  id: z.coerce.number(),
  type: z.string(),
  attributes: z.record(z.string(), z.unknown()),
});

const RoleAttributesSchema = z.object({
  type: z.string().optional(),
  name: z.string().optional(),
  person_id: z.coerce.number().optional(),
  group_id: z.coerce.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  deleted_at: z.string().nullable().optional(),
});

const InvoiceAttributesSchema = z.object({
  title: z.string(),
  state: z.string(),
  sequence_number: z.string().nullable().optional(),
  recipient_email: z.string().nullable().optional(),
  recipient_address: z.string().nullable().optional(),
  sent_at: z.string().nullable().optional(),
  due_at: z.string().nullable().optional(),
  total: z.string().nullable().optional(),
  amount_open: z.string().nullable().optional(),
  group_id: z.coerce.number().nullable().optional(),
  recipient_id: z.coerce.number().nullable().optional(),
});

const MailingListAttributesSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  publisher: z.string().nullable().optional(),
  mail_name: z.string().nullable().optional(),
  additional_sender: z.string().nullable().optional(),
  subscribable: z.boolean().nullable().optional(),
  subscribers_may_post: z.boolean().nullable().optional(),
  anyone_may_post: z.boolean().nullable().optional(),
  group_id: z.coerce.number().nullable().optional(),
});

const EventKindAttributesSchema = z.object({
  label: z.string(),
  short_name: z.string().nullable().optional(),
  minimum_age: z.coerce.number().nullable().optional(),
  general_information: z.string().nullable().optional(),
  application_conditions: z.string().nullable().optional(),
});

const EventKindCategoryAttributesSchema = z.object({
  label: z.string(),
  order: z.coerce.number().nullable().optional(),
});

export const PersonSchema = z
  .object({
    data: z.object({
      id: z.coerce.number(),
      type: z.literal("people"),
      attributes: PersonAttributesSchema,
    }),
  })
  .transform((val) => ({
    id: val.data.id,
    ...val.data.attributes,
  }));

export const GroupSchema = z
  .object({
    data: z.object({
      id: z.coerce.number(),
      type: z.literal("groups"),
      attributes: GroupAttributesSchema,
    }),
  })
  .transform((val) => ({
    id: val.data.id,
    type: val.data.type,
    ...val.data.attributes,
  }));

export const EventSchema = z
  .object({
    data: z.object({
      id: z.coerce.number(),
      type: z.string(),
      attributes: EventAttributesSchema,
      relationships: EventRelationshipSchema.optional(),
    }),
    included: z.array(IncludedResourceSchema).optional(),
  })
  .transform((val) => {
    const group_ids =
      val.data.attributes.group_ids ??
      val.data.relationships?.groups?.data?.map((g) => g.id) ??
      [];
    const dateIds = new Set(
      val.data.relationships?.dates?.data?.map((d) => d.id) ?? []
    );
    const dates = (val.included ?? [])
      .filter((inc) => inc.type === "event_dates" && dateIds.has(inc.id))
      .map((inc) => ({
        id: inc.id,
        ...EventDateAttributesSchema.parse(inc.attributes),
      }));

    const { group_ids: _discardAttrGroupIds, ...restAttrs } =
      val.data.attributes;
    return {
      id: val.data.id,
      ...restAttrs,
      dates,
      group_ids,
    };
  });

export const RoleSchema = z
  .object({
    data: z.object({
      id: z.coerce.number(),
      type: z.literal("roles"),
      attributes: RoleAttributesSchema,
    }),
  })
  .transform((val) => ({
    id: val.data.id,
    type: val.data.attributes.type || "",
    name: val.data.attributes.name,
    person_id: val.data.attributes.person_id || 0,
    group_id: val.data.attributes.group_id || 0,
    created_at: val.data.attributes.created_at || "",
    updated_at: val.data.attributes.updated_at || "",
    deleted_at: val.data.attributes.deleted_at,
  }));

export const InvoiceSchema = z
  .object({
    data: z.object({
      id: z.coerce.number(),
      type: z.literal("invoices"),
      attributes: InvoiceAttributesSchema,
    }),
  })
  .transform((val) => ({
    id: val.data.id,
    ...val.data.attributes,
  }));

export const MailingListSchema = z
  .object({
    data: z.object({
      id: z.coerce.number(),
      type: z.literal("mailing_lists"),
      attributes: MailingListAttributesSchema,
    }),
  })
  .transform((val) => ({
    id: val.data.id,
    ...val.data.attributes,
  }));

export const EventKindSchema = z
  .object({
    data: z.object({
      id: z.coerce.number(),
      type: z.literal("event_kinds"),
      attributes: EventKindAttributesSchema,
    }),
  })
  .transform((val) => ({
    id: val.data.id,
    ...val.data.attributes,
  }));

export const EventKindCategorySchema = z
  .object({
    data: z.object({
      id: z.coerce.number(),
      type: z.literal("event_kind_categories"),
      attributes: EventKindCategoryAttributesSchema,
    }),
  })
  .transform((val) => ({
    id: val.data.id,
    ...val.data.attributes,
  }));

export const PeopleResponseSchema = z
  .object({
    data: z.array(
      z.object({
        id: z.coerce.number(),
        type: z.literal("people"),
        attributes: PersonAttributesSchema,
      })
    ),
  })
  .transform((val) =>
    val.data.map((item) => ({
      id: item.id,
      ...item.attributes,
    }))
  );

export const GroupsResponseSchema = z
  .object({
    data: z.array(
      z.object({
        id: z.coerce.number(),
        type: z.literal("groups"),
        attributes: GroupAttributesSchema,
      })
    ),
  })
  .transform((val) =>
    val.data.map((item) => ({
      id: item.id,
      type: item.type,
      ...item.attributes,
    }))
  );

export const EventsResponseSchema = z
  .object({
    data: z.array(
      z.object({
        id: z.coerce.number(),
        type: z.string(),
        attributes: EventAttributesSchema,
        relationships: EventRelationshipSchema.optional(),
      })
    ),
    included: z.array(IncludedResourceSchema).optional(),
  })
  .transform((val) =>
    val.data.map((item) => {
      const group_ids =
        item.attributes.group_ids ??
        item.relationships?.groups?.data?.map((g) => g.id) ??
        [];
      const dateIds = new Set(
        item.relationships?.dates?.data?.map((d) => d.id) ?? []
      );
      const dates = (val.included ?? [])
        .filter((inc) => inc.type === "event_dates" && dateIds.has(inc.id))
        .map((inc) => ({
          id: inc.id,
          ...EventDateAttributesSchema.parse(inc.attributes),
        }));

      const { group_ids: _discardAttrGroupIds, ...restAttrs } =
        item.attributes;
      return {
        id: item.id,
        ...restAttrs,
        dates,
        group_ids,
      };
    })
  );

export const RolesResponseSchema = z
  .object({
    data: z.array(
      z.object({
        id: z.coerce.number(),
        type: z.literal("roles"),
        attributes: RoleAttributesSchema,
      })
    ),
  })
  .transform((val) =>
    val.data.map((item) => ({
      id: item.id,
      type: item.attributes.type || "",
      name: item.attributes.name,
      person_id: item.attributes.person_id || 0,
      group_id: item.attributes.group_id || 0,
      created_at: item.attributes.created_at || "",
      updated_at: item.attributes.updated_at || "",
      deleted_at: item.attributes.deleted_at,
    }))
  );

export const InvoicesResponseSchema = z
  .object({
    data: z.array(
      z.object({
        id: z.coerce.number(),
        type: z.literal("invoices"),
        attributes: InvoiceAttributesSchema,
      })
    ),
  })
  .transform((val) =>
    val.data.map((item) => ({
      id: item.id,
      ...item.attributes,
    }))
  );

export const MailingListsResponseSchema = z
  .object({
    data: z.array(
      z.object({
        id: z.coerce.number(),
        type: z.literal("mailing_lists"),
        attributes: MailingListAttributesSchema,
      })
    ),
  })
  .transform((val) =>
    val.data.map((item) => ({
      id: item.id,
      ...item.attributes,
    }))
  );

export const EventKindsResponseSchema = z
  .object({
    data: z.array(
      z.object({
        id: z.coerce.number(),
        type: z.literal("event_kinds"),
        attributes: EventKindAttributesSchema,
      })
    ),
  })
  .transform((val) =>
    val.data.map((item) => ({
      id: item.id,
      ...item.attributes,
    }))
  );

export const EventKindCategoriesResponseSchema = z
  .object({
    data: z.array(
      z.object({
        id: z.coerce.number(),
        type: z.literal("event_kind_categories"),
        attributes: EventKindCategoryAttributesSchema,
      })
    ),
  })
  .transform((val) =>
    val.data.map((item) => ({
      id: item.id,
      ...item.attributes,
    }))
  );
