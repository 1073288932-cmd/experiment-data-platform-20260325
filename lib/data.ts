import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { TOTAL_GROUPS, type ExperimentRow, type StudentSubmissionPayload } from "@/lib/experiment";

const TABLE_NAME = "experiment_rows";

export async function listExperimentRows() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .lte("group_no", TOTAL_GROUPS)
    .order("group_no", { ascending: true });

  if (error) {
    throw new Error(`Failed to list experiment rows: ${error.message}`);
  }

  return (data ?? []) as ExperimentRow[];
}

export async function getExperimentRow(groupNo: number) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("group_no", groupNo)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load group ${groupNo}: ${error.message}`);
  }

  return data as ExperimentRow | null;
}

export async function updateExperimentRow(payload: StudentSubmissionPayload) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      glass_result: payload.glassResult,
      rubber_result: payload.rubberResult,
      updated_at: new Date().toISOString()
    })
    .eq("group_no", payload.groupNo)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update group ${payload.groupNo}: ${error.message}`);
  }

  return data as ExperimentRow | null;
}

export async function resetExperimentRows() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      glass_result: null,
      rubber_result: null,
      updated_at: null
    })
    .gt("group_no", 0)
    .lte("group_no", TOTAL_GROUPS)
    .select("*");

  if (error) {
    throw new Error(`Failed to reset experiment rows: ${error.message}`);
  }

  return (data ?? []) as ExperimentRow[];
}
