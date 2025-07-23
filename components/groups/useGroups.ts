"use client";
import { useEffect, useState } from "react";

export function useGroups() {
  const [groups, setGroups] = useState<{id:string;name:string}[]>([]);
  useEffect(()=>{ (async()=>{ const res=await fetch("/api/groups"); setGroups(await res.json()); })(); },[]);
  return groups;
}
