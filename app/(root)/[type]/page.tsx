import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getFileTypesParams } from "@/lib/utils";
import { Models } from "node-appwrite";
import React from "react";

const page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";
  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";

  const types = getFileTypesParams(type) as FileType[];

  // Fetch files and total space concurrently
  const [files, totalSpace] = await Promise.all([
    getFiles({ types, searchText, sort }),
    getTotalSpaceUsed(),
  ]);

  console.log("Type:", type);
  console.log("Total Space Data:", totalSpace);

  // Ensure type is formatted properly when checking totalSpace[type]
  const formattedType = type.endsWith("s") ? type.slice(0, -1) : type;
  const usedSpace = totalSpace[formattedType]?.size || 0;
  const formattedUsedSpace = convertFileSize(usedSpace);

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total Files: <span className="h5">{files?.total || 0}</span>
          </p>
          <p className="body-1">
            Total Size: <span className="h5">{formattedUsedSpace}</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>

      {/* Render the files */}
      {files.total > 0 ? (
        <section className="file-list">
          {files.documents.map((file: Models.Document) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded.</p>
      )}
    </div>
  );
};

export default page;
