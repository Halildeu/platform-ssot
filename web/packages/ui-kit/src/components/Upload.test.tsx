import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Upload from './Upload';

describe('Upload', () => {
  test('label, aciklama ve mevcut dosyalari gosterir', () => {
    render(
      <Upload
        label="Ekler"
        description="Politika paketini yukle."
        hint="PDF ve DOCX kabul edilir."
        defaultFiles={[{ name: 'policy.pdf', size: 2048, type: 'application/pdf' }]}
      />,
    );

    expect(screen.getByText('Politika paketini yukle.')).toBeInTheDocument();
    expect(screen.getByText('PDF ve DOCX kabul edilir.')).toBeInTheDocument();
    expect(screen.getByText('policy.pdf')).toBeInTheDocument();
    expect(screen.getByText('2 KB')).toBeInTheDocument();
  });

  test('onFilesChange secilen dosyalari uretir', () => {
    const handleFilesChange = jest.fn();

    render(<Upload label="Kanit dosyasi" onFilesChange={handleFilesChange} multiple />);

    const input = screen.getByLabelText(/Kanit dosyasi/i);
    const fileA = new File(['alpha'], 'alpha.txt', { type: 'text/plain' });
    const fileB = new File(['beta'], 'beta.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [fileA, fileB] } });

    expect(handleFilesChange).toHaveBeenCalled();
    expect(handleFilesChange.mock.calls.at(-1)[0]).toEqual([
      expect.objectContaining({ name: 'alpha.txt' }),
      expect.objectContaining({ name: 'beta.txt' }),
    ]);
  });

  test('readonly access durumunda degisim bloklanir', () => {
    const handleFilesChange = jest.fn();

    render(<Upload label="Readonly upload" access="readonly" onFilesChange={handleFilesChange} />);

    const input = screen.getByLabelText(/Readonly upload/i);
    const file = new File(['locked'], 'locked.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(handleFilesChange).not.toHaveBeenCalled();
    expect(screen.getByText('Henuz dosya secilmedi.')).toBeInTheDocument();
  });

  test('maxFiles limitini uygular', () => {
    const handleFilesChange = jest.fn();

    render(<Upload label="Limitli upload" maxFiles={1} multiple onFilesChange={handleFilesChange} />);

    const input = screen.getByLabelText(/Limitli upload/i);
    const fileA = new File(['alpha'], 'alpha.txt', { type: 'text/plain' });
    const fileB = new File(['beta'], 'beta.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [fileA, fileB] } });

    expect(handleFilesChange.mock.calls.at(-1)[0]).toHaveLength(1);
    expect(screen.getByText('alpha.txt')).toBeInTheDocument();
  });

  test('hidden access durumunda render etmez', () => {
    render(<Upload label="Gizli upload" access="hidden" />);

    expect(screen.queryByLabelText(/Gizli upload/i)).not.toBeInTheDocument();
  });
});
