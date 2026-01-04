"use client";

import { Button } from "@repo/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/ui/components/empty";
import { MonitorCog } from "@repo/ui/icons";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <MonitorCog />
          </EmptyMedia>
          <EmptyTitle>In Development</EmptyTitle>
          <EmptyDescription>
            Please waiting for Production Ready!
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant={"outline"} asChild>
            <Link href={"mailto:fakultasteknik@unpas.ac.id"}>Contact Us</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default HomePage;
