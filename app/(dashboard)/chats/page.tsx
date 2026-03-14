"use client";

import { useState, Fragment } from "react";
import { format } from "date-fns";
import {
  ArrowLeft,
  Send,
  MessagesSquare,
  SearchIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { type ChatUser, type Convo, conversations } from "./data";

export default function ChatsPage() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [mobileSelectedUser, setMobileSelectedUser] =
    useState<ChatUser | null>(null);
  const [messageInput, setMessageInput] = useState("");

  const filteredChatList = conversations.filter(({ fullName }) =>
    fullName.toLowerCase().includes(search.trim().toLowerCase())
  );

  const currentMessage = selectedUser?.messages.reduce(
    (acc: Record<string, Convo[]>, obj) => {
      const key = format(new Date(obj.timestamp), "d MMM, yyyy");
      if (!acc[key]) acc[key] = [];
      acc[key].push(obj);
      return acc;
    },
    {}
  );

  const activeUser = mobileSelectedUser || selectedUser;

  return (
    <>
      <Header>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <section className="flex h-full gap-6">
          {/* Left Side */}
          <div
            className={cn(
              "flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80",
              mobileSelectedUser && "hidden sm:flex"
            )}
          >
            <div className="sticky top-0 z-10 -mx-2 bg-background px-2 pb-2">
              <div className="flex items-center justify-between py-2">
                <div className="flex gap-2">
                  <h1 className="text-2xl font-bold">Chats</h1>
                  <span className="rounded-lg bg-muted px-2 py-1 text-xs font-medium">
                    {conversations.length}
                  </span>
                </div>
              </div>
              <label className="flex h-9 items-center rounded-md border bg-background px-3">
                <SearchIcon size={15} className="text-muted-foreground" />
                <input
                  type="text"
                  className="w-full bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Search chat..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>
            <ScrollArea className="-mx-3 h-full">
              {filteredChatList.map((chatUser) => {
                const lastMessage =
                  chatUser.messages[chatUser.messages.length - 1];
                const initials = chatUser.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("");
                return (
                  <button
                    key={chatUser.id}
                    type="button"
                    className={cn(
                      "flex w-full gap-3 rounded-md p-3 text-start hover:bg-accent",
                      selectedUser?.id === chatUser.id && "bg-muted sm:bg-muted"
                    )}
                    onClick={() => {
                      setSelectedUser(chatUser);
                      setMobileSelectedUser(chatUser);
                    }}
                  >
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {chatUser.fullName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(lastMessage.timestamp),
                            "h:mm a"
                          )}
                        </span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {lastMessage.message}
                      </p>
                    </div>
                  </button>
                );
              })}
            </ScrollArea>
          </div>

          {/* Right Side */}
          {activeUser ? (
            <div
              className={cn(
                "flex flex-1 flex-col",
                !mobileSelectedUser && "hidden sm:flex"
              )}
            >
              <div className="flex items-center gap-3 border-b pb-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="sm:hidden"
                  onClick={() => setMobileSelectedUser(null)}
                >
                  <ArrowLeft />
                </Button>
                <Avatar>
                  <AvatarFallback>
                    {activeUser.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{activeUser.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {activeUser.title}
                  </p>
                </div>
              </div>

              <ScrollArea className="flex-1 py-4">
                {currentMessage &&
                  Object.entries(currentMessage).map(([date, messages]) => (
                    <Fragment key={date}>
                      <div className="relative my-4 text-center">
                        <Separator />
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                          {date}
                        </span>
                      </div>
                      {messages.map((msg, i) => (
                        <div
                          key={i}
                          className={cn(
                            "mb-3 flex",
                            msg.sender === "You"
                              ? "justify-end"
                              : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                              msg.sender === "You"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            {msg.message}
                            <span className="mt-1 block text-[10px] opacity-60">
                              {format(new Date(msg.timestamp), "h:mm a")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </Fragment>
                  ))}
              </ScrollArea>

              <div className="flex gap-2 border-t pt-3">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1"
                />
                <Button size="icon">
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="hidden flex-1 flex-col items-center justify-center gap-4 sm:flex">
              <MessagesSquare className="size-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                Select a conversation to start messaging
              </p>
            </div>
          )}
        </section>
      </Main>
    </>
  );
}
