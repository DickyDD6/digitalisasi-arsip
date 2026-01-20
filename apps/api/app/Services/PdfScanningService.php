<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class PdfScanningService
{
    /**
     * Scan PDF file for potential threats.
     * This is a placeholder for future integration with antivirus services.
     *
     * @param UploadedFile $file
     * @return array{safe: bool, threats: array, message: string}
     */
    public function scanFile(UploadedFile $file): array
    {
        // Check if scanning is enabled
        if (!$this->isEnabled()) {
            return [
                'safe' => true,
                'threats' => [],
                'message' => 'Scanning disabled',
            ];
        }

        try {
            // TODO: Integrate with actual antivirus service
            // Options:
            // 1. ClamAV via shell_exec
            // 2. VirusTotal API
            // 3. AWS GuardDuty for S3 scanning
            // 4. Third-party API services

            // For now, perform basic heuristic checks
            $threats = $this->performBasicHeuristics($file);

            return [
                'safe' => empty($threats),
                'threats' => $threats,
                'message' => empty($threats)
                    ? 'File passed basic security checks'
                    : 'Potential threats detected',
            ];
        } catch (\Exception $e) {
            Log::error('PDF scanning failed', [
                'file' => $file->getClientOriginalName(),
                'error' => $e->getMessage(),
            ]);

            // On error, fail-safe: reject file
            return [
                'safe' => false,
                'threats' => ['Scanning error occurred'],
                'message' => 'Unable to verify file safety',
            ];
        }
    }

    /**
     * Perform basic heuristic checks on PDF.
     *
     * @param UploadedFile $file
     * @return array List of potential threats found
     */
    protected function performBasicHeuristics(UploadedFile $file): array
    {
        $threats = [];
        $content = file_get_contents($file->getRealPath());

        // Check for embedded JavaScript (common malware vector)
        if (
            stripos($content, '/JavaScript') !== false ||
            stripos($content, '/JS') !== false
        ) {
            $threats[] = 'Embedded JavaScript detected';
        }

        // Check for embedded files
        if (stripos($content, '/EmbeddedFile') !== false) {
            $threats[] = 'Embedded files detected';
        }

        // Check for launch actions (can execute programs)
        if (stripos($content, '/Launch') !== false) {
            $threats[] = 'Launch action detected';
        }

        // Check for suspicious URLs
        if (preg_match('/http[s]?:\/\/[^\s]+/i', $content, $matches)) {
            // This is informational, not necessarily a threat
            Log::info('URL found in PDF', ['urls' => $matches]);
        }

        return $threats;
    }

    /**
     * Check if PDF scanning is enabled.
     *
     * @return bool
     */
    public function isEnabled(): bool
    {
        return config('filesystems.scan_pdfs', false);
    }

    /**
     * Sanitize PDF by removing potentially dangerous elements.
     * Requires Ghostscript to be installed on the server.
     *
     * @param string $filePath
     * @return bool
     */
    public function sanitizePdf(string $filePath): bool
    {
        if (!$this->isGhostscriptAvailable()) {
            Log::warning('Ghostscript not available for PDF sanitization');
            return false;
        }

        try {
            $tempFile = $filePath . '.sanitized';

            $command = sprintf(
                'gs -dSAFER -dBATCH -dNOPAUSE -dNOOUTERSAVE -sDEVICE=pdfwrite -o %s %s 2>&1',
                escapeshellarg($tempFile),
                escapeshellarg($filePath)
            );

            exec($command, $output, $returnCode);

            if ($returnCode === 0 && file_exists($tempFile)) {
                // Replace original with sanitized version
                rename($tempFile, $filePath);
                Log::info('PDF sanitized successfully', ['file' => basename($filePath)]);
                return true;
            }

            Log::error('PDF sanitization failed', [
                'file' => basename($filePath),
                'return_code' => $returnCode,
                'output' => implode("\n", $output),
            ]);
            return false;
        } catch (\Exception $e) {
            Log::error('PDF sanitization exception', [
                'file' => basename($filePath),
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Check if Ghostscript is available.
     *
     * @return bool
     */
    protected function isGhostscriptAvailable(): bool
    {
        exec('gs --version 2>&1', $output, $returnCode);
        return $returnCode === 0;
    }
}
