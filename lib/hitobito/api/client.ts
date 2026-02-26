import {
  NotFoundError,
  RateLimitError,
  UnauthorizedError,
  ValidationError,
} from "./errors";
import {
  EventKindCategoriesResponseSchema,
  EventKindCategorySchema,
  EventKindSchema,
  EventKindsResponseSchema,
  EventSchema,
  EventsResponseSchema,
  GroupSchema,
  GroupsResponseSchema,
  InvoiceSchema,
  InvoicesResponseSchema,
  MailingListSchema,
  MailingListsResponseSchema,
  PeopleResponseSchema,
  PersonSchema,
  RoleSchema,
  RolesResponseSchema,
} from "./schemas";
import type {
  Event,
  EventKind,
  EventKindCategory,
  EventsFilter,
  EventsSortKey,
  Group,
  GroupsFilter,
  GroupsSortKey,
  HitobitoClientConfig,
  Invoice,
  InvoiceUpdate,
  InvoicesFilter,
  InvoicesSortKey,
  MailingList,
  MailingListsFilter,
  MailingListsSortKey,
  PeopleFilter,
  PeopleSortKey,
  Person,
  PersonUpdate,
  QueryOptions,
  Role,
  RoleCreate,
  RoleUpdate,
  RolesFilter,
  RolesSortKey,
} from "./types";

export class HitobitoClient {
  private baseUrl: string;
  private token: string;

  constructor(config: HitobitoClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.token = config.token;
  }

  private async request<T>(
    path: string,
    options: { method?: string; body?: unknown } = {}
  ): Promise<T> {
    const { method = "GET", body } = options;

    const fetchOptions: RequestInit = {
      method,
      headers: {
        "X-Token": this.token,
        Accept: "application/json",
        "Content-Type": "application/vnd.api+json",
      },
    };

    if (body !== undefined) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}/api${path}`, fetchOptions);

    if (response.status === 401) {
      throw new UnauthorizedError();
    }

    if (response.status === 403) {
      throw new UnauthorizedError("Forbidden: Access denied");
    }

    if (response.status === 404) {
      throw new NotFoundError();
    }

    if (response.status === 429) {
      throw new RateLimitError();
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  private buildQuery(
    options?: QueryOptions<Record<string, unknown>, string>
  ): string {
    if (!options) return "";

    const params = new URLSearchParams();

    if (options.filter) {
      for (const [key, value] of Object.entries(options.filter)) {
        if (value !== undefined) {
          params.set(`filter[${key}]`, String(value));
        }
      }
    }

    if (options.sort) {
      params.set("sort", options.sort);
    }

    if (options.page !== undefined) {
      params.set("page[number]", String(options.page));
    }

    if (options.per_page !== undefined) {
      params.set("page[size]", String(options.per_page));
    }

    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }

  async getPerson(id: number): Promise<Person> {
    const data = await this.request<unknown>(`/people/${id}`);
    const parsed = PersonSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid person response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async getGroup(id: number): Promise<Group> {
    const data = await this.request<unknown>(`/groups/${id}`);
    const parsed = GroupSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid group response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async getEvent(id: number): Promise<Event> {
    const data = await this.request<unknown>(`/events/${id}`);
    const parsed = EventSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid event response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async getRole(id: number): Promise<Role> {
    const data = await this.request<unknown>(`/roles/${id}`);
    const parsed = RoleSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid role response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async getInvoice(id: number): Promise<Invoice> {
    const data = await this.request<unknown>(`/invoices/${id}`);
    const parsed = InvoiceSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid invoice response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async getMailingList(id: number): Promise<MailingList> {
    const data = await this.request<unknown>(`/mailing_lists/${id}`);
    const parsed = MailingListSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid mailing list response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async getEventKind(id: number): Promise<EventKind> {
    const data = await this.request<unknown>(`/event_kinds/${id}`);
    const parsed = EventKindSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid event kind response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async getEventKindCategory(id: number): Promise<EventKindCategory> {
    const data = await this.request<unknown>(`/event_kind_categories/${id}`);
    const parsed = EventKindCategorySchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid event kind category response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async getPeople(
    options?: QueryOptions<PeopleFilter, PeopleSortKey>
  ): Promise<Person[]> {
    const qs = this.buildQuery(
      options as QueryOptions<Record<string, unknown>, string>
    );
    const data = await this.request<unknown>(`/people${qs}`);
    const parsed = PeopleResponseSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid people response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async getGroups(
    options?: QueryOptions<GroupsFilter, GroupsSortKey>
  ): Promise<Group[]> {
    const qs = this.buildQuery(
      options as QueryOptions<Record<string, unknown>, string>
    );
    const data = await this.request<unknown>(`/groups${qs}`);
    const parsed = GroupsResponseSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid groups response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async getEvents(
    options?: QueryOptions<EventsFilter, EventsSortKey>
  ): Promise<Event[]> {
    const qs = this.buildQuery(
      options as QueryOptions<Record<string, unknown>, string>
    );
    const data = await this.request<unknown>(`/events${qs}`);
    const parsed = EventsResponseSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid events response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async getRoles(
    options?: QueryOptions<RolesFilter, RolesSortKey>
  ): Promise<Role[]> {
    const qs = this.buildQuery(
      options as QueryOptions<Record<string, unknown>, string>
    );
    const data = await this.request<unknown>(`/roles${qs}`);
    const parsed = RolesResponseSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid roles response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async getInvoices(
    options?: QueryOptions<InvoicesFilter, InvoicesSortKey>
  ): Promise<Invoice[]> {
    const qs = this.buildQuery(
      options as QueryOptions<Record<string, unknown>, string>
    );
    const data = await this.request<unknown>(`/invoices${qs}`);
    const parsed = InvoicesResponseSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid invoices response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async getMailingLists(
    options?: QueryOptions<MailingListsFilter, MailingListsSortKey>
  ): Promise<MailingList[]> {
    const qs = this.buildQuery(
      options as QueryOptions<Record<string, unknown>, string>
    );
    const data = await this.request<unknown>(`/mailing_lists${qs}`);
    const parsed = MailingListsResponseSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid mailing lists response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async getEventKinds(options?: QueryOptions): Promise<EventKind[]> {
    const qs = this.buildQuery(
      options as QueryOptions<Record<string, unknown>, string>
    );
    const data = await this.request<unknown>(`/event_kinds${qs}`);
    const parsed = EventKindsResponseSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid event kinds response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async getEventKindCategories(
    options?: QueryOptions
  ): Promise<EventKindCategory[]> {
    const qs = this.buildQuery(
      options as QueryOptions<Record<string, unknown>, string>
    );
    const data = await this.request<unknown>(`/event_kind_categories${qs}`);
    const parsed = EventKindCategoriesResponseSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid event kind categories response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async updatePerson(id: number, attrs: PersonUpdate): Promise<Person> {
    const body = {
      data: {
        id: String(id),
        type: "people",
        attributes: attrs,
      },
    };
    const data = await this.request<unknown>(`/people/${id}`, {
      method: "PATCH",
      body,
    });
    const parsed = PersonSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid person response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async createRole(attrs: RoleCreate): Promise<Role> {
    const body = {
      data: {
        type: "roles",
        attributes: attrs,
      },
    };
    const data = await this.request<unknown>("/roles", {
      method: "POST",
      body,
    });
    const parsed = RoleSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid role response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async updateRole(id: number, attrs: RoleUpdate): Promise<Role> {
    const body = {
      data: {
        id: String(id),
        type: "roles",
        attributes: attrs,
      },
    };
    const data = await this.request<unknown>(`/roles/${id}`, {
      method: "PATCH",
      body,
    });
    const parsed = RoleSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid role response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  async deleteRole(id: number): Promise<void> {
    await this.request<void>(`/roles/${id}`, { method: "DELETE" });
  }

  async updateInvoice(id: number, attrs: InvoiceUpdate): Promise<Invoice> {
    const body = {
      data: {
        id: String(id),
        type: "invoices",
        attributes: attrs,
      },
    };
    const data = await this.request<unknown>(`/invoices/${id}`, {
      method: "PATCH",
      body,
    });
    const parsed = InvoiceSchema.safeParse(data);

    if (!parsed.success) {
      throw new ValidationError(
        `Invalid invoice response: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }
}
