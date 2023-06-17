/* eslint-disable */
// This file is auto-generated

import * as t from "ts-interface-checker";

export const TypeApiRoute = t.iface([], {
  "url": "string",
  "mock": t.opt("any"),
  "method": t.union(t.lit('GET'), t.lit('POST'), t.lit('PUT'), t.lit('DELETE')),
  "headers": t.opt("any"),
});