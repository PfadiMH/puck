import type { Meta, StoryObj } from "@storybook/react";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

const meta: Meta<typeof Table> = {
  component: Table,
  title: "Components/Table",
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Primary: Story = {
  args: {
    children: (
      <>
        {/* An example table showing a list of files */}
        <TableHeader>
          <TableRow>
            <TableHead>File name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>file1.txt</TableCell>
            <TableCell>1.2 MB</TableCell>
            <TableCell>Text File</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>file2.jpg</TableCell>
            <TableCell>2.5 MB</TableCell>
            <TableCell>Image File</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>file3.pdf</TableCell>
            <TableCell>500 KB</TableCell>
            <TableCell>PDF Document</TableCell>
          </TableRow>
        </TableBody>
      </>
    ),
  },
};
