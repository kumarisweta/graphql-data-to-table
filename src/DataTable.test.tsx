// DataTable.test.js
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import DataTable from './DataTable';
import { DocumentNode } from 'graphql';

const mocks: ReadonlyArray<MockedResponse> = [
  {
    request: {
      query: {} as DocumentNode,
    },
    result: {
      data: {
        countries: [
          { name: 'Portugal', code: 'PT' },
          { name: 'India', code: 'IN' },
        ],
      },
    },
  },
];

describe('DataTable', () => {
  it("renders without error", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DataTable data={[]} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryAllByText("India")).toHaveLength(1);
    });
  });
});
