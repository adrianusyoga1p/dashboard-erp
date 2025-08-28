import { BaseButton } from "@/components/base/button";
import { BaseInput } from "@/components/base/input";
import BaseModal from "@/components/base/modal";
import { useState, type ReactNode } from "react";
import { LuDownload } from "react-icons/lu";
import Papa from "papaparse";
import type { UnitPayload } from "@/types/unit";
import BaseTable, { type ColumnDefinition } from "@/components/base/table";
import { apiImportUnit } from "@/api/endpoints/unit";
import BaseAlert from "@/components/base/alert";

interface UnitModalProps {
  trigger: ReactNode;
  loadData: () => void;
}

export const UnitModal = ({ trigger, loadData }: UnitModalProps) => {
  const [columns, setColumns] = useState<ColumnDefinition[]>([]);
  const [data, setData] = useState<UnitPayload[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [closeModal, setCloseModal] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    isOpen: boolean;
    type: "success" | "warning" | "error";
    message?: string;
  }>({
    isOpen: false,
    type: "success",
    message: "",
  });

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const selectedFile = selectedFiles[0];
    setFile(selectedFile);
    if (!selectedFile) return;

    Papa.parse(selectedFile, {
      complete: (result) => {
        if (result.data && result.data.length > 0) {
          const headers = result.data[0] as string[];

          const mappedColumns: ColumnDefinition[] = headers.map((header) => ({
            title: header,
            key: header,
            align: "center",
          }));
          setColumns(mappedColumns);

          const rows = (result.data as string[][])
            .filter((x) => !x.every((y) => !y))
            .slice(1, 6)
            .map((row) =>
              row.reduce((acc, val, index) => {
                acc[headers[index]] = val;
                return acc;
              }, {} as Record<string, unknown>)
            ) as UnitPayload[];

          setData(rows);
        }
      },
      error: (error) => {
        console.error("Error reading CSV : ", error);
      },
    });
  };

  const submitImport = async () => {
    if (!file) return;
    console.log(file);
    const { error } = await apiImportUnit(file);
    if (!error) {
      setSubmitStatus({
        isOpen: true,
        type: "success",
        message: "Import data success!",
      });
      setCloseModal(false);
      loadData();
    }
  };

  return (
    <>
      <BaseAlert
        open={submitStatus.isOpen}
        onOpenChange={(open) =>
          setSubmitStatus({ ...submitStatus, isOpen: open })
        }
        title={submitStatus.type === "success" ? "Success" : "Error"}
        message={submitStatus.message}
        type={submitStatus.type}
        footerSlot={
          <BaseButton
            onClick={() => {
              setSubmitStatus((prev) => ({
                ...prev,
                isOpen: false,
              }));
            }}
          >
            Close
          </BaseButton>
        }
      />
      <BaseModal
        trigger={trigger}
        title="Import Unit Data"
        action={<BaseButton onClick={submitImport}>Submit</BaseButton>}
        onOpenChange={(open) => {
          setData([]);
          setFile(null);
          setCloseModal(open);
        }}
        open={closeModal}
      >
        <div className="flex gap-4 justify-between items-center p-4 bg-slate-100 rounded-md">
          <div className="space-y-2">
            <h3 className="font-semibold">Template CSV</h3>
            <p className="text-gray-400 text-sm flex items-start gap-2">
              You can download the attached template and use them as a starting
              point for your own file.
            </p>
          </div>
          <a
            href="/docs/Import_Product.csv"
            download
            className="flex gap-2 border transition-colors duration-200 justify-center items-center disabled:bg-black/40 bg-black text-white border-black hover:bg-black/70 hover:border-black/0 px-4 py-2 rounded-lg"
          >
            <LuDownload />
            Download
          </a>
        </div>
        <div>
          <BaseInput
            accept=".csv"
            label="Upload File Import"
            id="import-unit"
            type="file"
            onChange={handleImport}
          />
          <span className="text-sm text-gray-400 italic block mt-3">
            Only supported csv file
          </span>
        </div>

        {data.length > 0 && columns.length > 0 && (
          <BaseTable<UnitPayload> source={data} columns={columns} />
        )}
      </BaseModal>
    </>
  );
};
