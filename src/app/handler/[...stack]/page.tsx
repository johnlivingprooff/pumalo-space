import { stackServerApp } from "@stack/server";
import { StackHandler } from "@stackframe/stack";

export default function Handler(props: any) {
  return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
}
