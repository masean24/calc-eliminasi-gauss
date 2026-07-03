document.addEventListener('DOMContentLoaded', () => {
  // --- Elemen DOM ---
  const matrixContainer = document.getElementById('matrix-container');
  const sizeButtons = document.querySelectorAll('.btn-size');
  const btnRandomize = document.getElementById('btn-randomize');
  const btnClear = document.getElementById('btn-clear');
  const btnSolve = document.getElementById('btn-solve');
  const outputPlaceholder = document.getElementById('output-placeholder');
  const resultContent = document.getElementById('result-content');
  const variablesResult = document.getElementById('variables-result');
  const stepCountBadge = document.getElementById('step-count');
  const stepsTimeline = document.getElementById('steps-timeline');

  // --- Kondisi Aplikasi ---
  let N = 3; // Ukuran matriks awal (3x3)a
  let activeCell = null; // Sel input yang sedang aktif
  const EPSILON = 1e-9;

  // --- Inisialisasi Aplikasi ---
  initMatrixGrid();
  setupEventListeners();

  // --- Pembuatan Grid Dinamis ---
  function initMatrixGrid() {
    matrixContainer.innerHTML = '';
    
    const table = document.createElement('table');
    table.className = 'matrix-table';

    // 1. Membuat kepala tabel (thead)
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Sel kosong di pojok kiri atas
    const cornerTh = document.createElement('th');
    cornerTh.className = 'row-header';
    cornerTh.innerHTML = 'SPL';
    headerRow.appendChild(cornerTh);

    // Header untuk variabel x_1 sampai x_N
    for (let c = 0; c < N; c++) {
      const th = document.createElement('th');
      th.innerHTML = `x<sub>${c + 1}</sub>`;
      headerRow.appendChild(th);
    }

    // Header untuk konstanta b
    const rhsTh = document.createElement('th');
    rhsTh.className = 'rhs-header';
    rhsTh.innerHTML = 'b (Konstanta)';
    headerRow.appendChild(rhsTh);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 2. Membuat isi tabel (tbody)
    const tbody = document.createElement('tbody');
    
    for (let r = 0; r < N; r++) {
      const row = document.createElement('tr');

      // Header nama baris
      const rowNameTh = document.createElement('th');
      rowNameTh.className = 'row-header';
      rowNameTh.innerHTML = `B<sub>${r + 1}</sub>`;
      row.appendChild(rowNameTh);

      // Input koefisien (kolom 0 sampai N-1)
      for (let c = 0; c < N; c++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.inputMode = 'decimal';
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.className = 'matrix-cell';
        input.placeholder = '0';
        input.dataset.row = r;
        input.dataset.col = c;

        input.addEventListener('focus', (e) => {
          setActiveCell(e.target);
        });
        input.addEventListener('input', () => {
          input.classList.remove('input-error');
        });

        td.appendChild(input);
        row.appendChild(td);
      }

      // Input konstanta (kolom N)
      const rhsTd = document.createElement('td');
      rhsTd.className = 'rhs-cell';
      
      const rhsInput = document.createElement('input');
      rhsInput.type = 'text';
      rhsInput.inputMode = 'decimal';
      rhsInput.autocomplete = 'off';
      rhsInput.spellcheck = false;
      rhsInput.className = 'matrix-cell';
      rhsInput.placeholder = '0';
      rhsInput.dataset.row = r;
      rhsInput.dataset.col = N;

      rhsInput.addEventListener('focus', (e) => {
        setActiveCell(e.target);
      });
      rhsInput.addEventListener('input', () => {
        rhsInput.classList.remove('input-error');
      });

      rhsTd.appendChild(rhsInput);
      row.appendChild(rhsTd);

      tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
    matrixContainer.appendChild(table);
    
    // Fokus otomatis ke sel pertama
    focusCell(0, 0);
  }

  function setActiveCell(cell) {
    if (activeCell) {
      activeCell.classList.remove('focused-cell');
    }
    activeCell = cell;
    if (activeCell) {
      activeCell.classList.add('focused-cell');
    }
  }

  function focusCell(r, c) {
    const target = matrixContainer.querySelector(`input[data-row="${r}"][data-col="${c}"]`);
    if (target) {
      target.focus();
      setActiveCell(target);
    }
  }

  // --- Pengatur Navigasi ---
  function setupEventListeners() {
    // 1. Tombol ukuran matriks
    sizeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sizeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        N = parseInt(btn.dataset.size, 10);
        initMatrixGrid();
      });
    });

    // 2. Membersihkan matriks
    btnClear.addEventListener('click', () => {
      const inputs = matrixContainer.querySelectorAll('.matrix-cell');
      inputs.forEach(input => {
        input.value = '';
        input.classList.remove('input-error');
      });
      focusCell(0, 0);
    });

    // 3. Mengisi matriks dengan nilai acak
    btnRandomize.addEventListener('click', () => {
      for (let r = 0; r < N; r++) {
        for (let c = 0; c <= N; c++) {
          const input = matrixContainer.querySelector(`input[data-row="${r}"][data-col="${c}"]`);
          if (input) {
            // Koefisien: diagonal dibuat tidak nol, nilai lain antara -9 sampai 9
            let val;
            if (r === c) {
              val = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 8) + 2); // 2 sampai 9, atau -9 sampai -2
            } else {
              val = Math.floor(Math.random() * 19) - 9; // -9 sampai 9
            }
            input.value = val;
          }
        }
      }
      focusCell(0, 0);
    });

    // 4. Tombol selesaikan
    btnSolve.addEventListener('click', solveGauss);

    // 5. Mendukung navigasi keyboard fisik di dalam sel
    matrixContainer.addEventListener('keydown', (e) => {
      if (!activeCell) return;
      const r = parseInt(activeCell.dataset.row, 10);
      const c = parseInt(activeCell.dataset.col, 10);

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          focusCell(Math.max(0, r - 1), c);
          break;
        case 'ArrowDown':
          e.preventDefault();
          focusCell(Math.min(N - 1, r + 1), c);
          break;
        case 'ArrowLeft':
          if (activeCell.selectionStart === 0) {
            e.preventDefault();
            navigateHorizontal(r, c, -1);
          }
          break;
        case 'ArrowRight':
          if (activeCell.selectionStart === activeCell.value.length) {
            e.preventDefault();
            navigateHorizontal(r, c, 1);
          }
          break;
        case 'Tab':
          e.preventDefault();
          navigateHorizontal(r, c, e.shiftKey ? -1 : 1);
          break;
        case 'Enter':
          e.preventDefault();
          solveGauss();
          break;
      }
    });
  }

  function navigateHorizontal(r, c, direction) {
    let nextCol = c + direction;
    let nextRow = r;
    if (nextCol < 0) {
      nextRow = r - 1;
      nextCol = N; // Pindah ke kolom konstanta pada baris sebelumnya
    } else if (nextCol > N) {
      nextRow = r + 1;
      nextCol = 0; // Pindah ke awal baris berikutnya
    }

    if (nextRow >= 0 && nextRow < N) {
      focusCell(nextRow, nextCol);
    }
  }

  // --- Bantuan Perhitungan Matematika ---
  function formatNum(num) {
    if (Math.abs(num) < 1e-12) return '0';
    // Format maksimal 4 angka di belakang koma, lalu hapus nol di akhir
    return parseFloat(num.toFixed(4)).toString();
  }

  function parseMatrixValue(input) {
    const rawValue = input.value.trim();
    const normalizedValue = rawValue.replace(',', '.');
    const validNumberPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;

    if (!rawValue || !validNumberPattern.test(normalizedValue)) {
      return {
        valid: false,
        message: `Isi sel ${getCellLabel(input)} dengan angka yang valid. Contoh: 0, -2, atau 3.5.`
      };
    }

    return {
      valid: true,
      value: Number(normalizedValue)
    };
  }

  function getCellLabel(input) {
    const row = Number(input.dataset.row) + 1;
    const col = Number(input.dataset.col);
    const columnLabel = col === N ? 'b' : `x${col + 1}`;
    return `B${row}, ${columnLabel}`;
  }

  function clearInputErrors() {
    matrixContainer.querySelectorAll('.matrix-cell.input-error').forEach(input => {
      input.classList.remove('input-error');
    });
  }

  function classifyNoUniqueSystem(matrix) {
    const inconsistent = matrix.some(row => {
      const allCoefficientsZero = row.slice(0, N).every(value => Math.abs(value) < EPSILON);
      return allCoefficientsZero && Math.abs(row[N]) >= EPSILON;
    });

    if (inconsistent) {
      return {
        title: 'Tidak Ada Solusi',
        message: 'Sistem Persamaan Linear tidak konsisten, sehingga tidak memiliki solusi.'
      };
    }

    return {
      title: 'Solusi Tidak Tunggal',
      message: 'Sistem Persamaan Linear memiliki solusi tak hingga atau tidak dapat ditentukan secara unik.'
    };
  }

  // --- Penyelesai Eliminasi Gauss ---
  function solveGauss() {
    // 1. Membaca dan memvalidasi input
    clearInputErrors();
    const M = [];
    for (let r = 0; r < N; r++) {
      const row = [];
      for (let c = 0; c <= N; c++) {
        const input = matrixContainer.querySelector(`input[data-row="${r}"][data-col="${c}"]`);
        const parsed = parseMatrixValue(input);

        if (!parsed.valid) {
          input.classList.add('input-error');
          input.focus();
          setActiveCell(input);
          renderFailure('Input Belum Valid', parsed.message);
          return;
        }

        row.push(parsed.value);
      }
      M.push(row);
    }

    const steps = [];
    
    // Bantuan untuk menyimpan log setiap langkah
    function logStep(type, description, matrixState, details = {}) {
      steps.push({
        type,
        description,
        matrixState: matrixState.map(r => [...r]),
        ...details
      });
    }

    // Menyimpan kondisi awal matriks
    logStep('init', 'Matriks augmented awal dari persamaan linear yang diinput.', M);

    // Eliminasi maju dengan pivoting parsial
    let M_elim = M.map(r => [...r]);
    let success = true;

    for (let k = 0; k < N; k++) {
      // 1. Pivoting parsial
      let maxVal = Math.abs(M_elim[k][k]);
      let maxRow = k;
      
      for (let i = k + 1; i < N; i++) {
        if (Math.abs(M_elim[i][k]) > maxVal) {
          maxVal = Math.abs(M_elim[i][k]);
          maxRow = i;
        }
      }

      // Jika elemen terbesar di kolom ini mendekati nol, matriks tidak punya solusi tunggal
      if (maxVal < EPSILON) {
        logStep('pivoting-step', `Gagal melanjutkan: Kolom ke-${k+1} bernilai nol untuk seluruh baris di bawahnya. Matriks tidak memiliki solusi tunggal.`, M_elim, {
          pivotRow: k,
          pivotCol: k,
          failed: true
        });
        success = false;
        break;
      }

      // Tukar baris k dengan maxRow jika posisinya berbeda
      if (maxRow !== k) {
        const temp = M_elim[k];
        M_elim[k] = M_elim[maxRow];
        M_elim[maxRow] = temp;
        
        logStep('pivoting-step', `Menukar <strong>Baris ${k + 1}</strong> dengan <strong>Baris ${maxRow + 1}</strong> karena koefisien pivot terbesar di kolom-${k+1} adalah |${formatNum(M_elim[k][k])}|.`, M_elim, {
          pivotRow: k,
          pivotCol: k,
          swappedWith: maxRow,
          formula: `R_${k + 1} ↔ R_${maxRow + 1}`
        });
      }

      // 2. Mengeliminasi elemen di bawah pivot M_elim[k][k]
      for (let i = k + 1; i < N; i++) {
        const elimTarget = M_elim[i][k];
        if (Math.abs(elimTarget) < EPSILON) {
          // Sudah nol, jadi tidak perlu dihitung ulang
          continue;
        }

        // Simpan nilai asli sebelum dimodifikasi
        const factor = elimTarget / M_elim[k][k];

        // Melakukan operasi: R_i = R_i - factor * R_k
        // Mulai dari j=k+1 karena kolom k akan dipaksa 0 secara eksplisit
        for (let j = k + 1; j <= N; j++) {
          M_elim[i][j] = M_elim[i][j] - factor * M_elim[k][j];
        }
        M_elim[i][k] = 0; // Paksa menjadi nol agar tidak terkena galat floating-point

        logStep('elimination-step',
          `Mengeliminasi elemen di <strong>Baris ${i + 1}, Kolom ${k + 1}</strong>. ` +
          `Pengali $m = \\frac{${formatNum(elimTarget)}}{${formatNum(M_elim[k][k])}} = ${formatNum(factor)}$.`,
          M_elim, {
            pivotRow: k,
            pivotCol: k,
            targetRow: i,
            targetCol: k,
            formula: `R_${i + 1} ← R_${i + 1} - (${formatNum(factor)}) \\times R_${k + 1}`
          });
      }
    }

    if (!success) {
      const classification = classifyNoUniqueSystem(M_elim);
      renderFailure(classification.title, classification.message);
      return;
    }

    // Substitusi mundur
    const X = new Array(N).fill(0);
    
    // Cek apakah elemen kanan bawah bernilai nol
    if (Math.abs(M_elim[N - 1][N - 1]) < EPSILON) {
      const classification = classifyNoUniqueSystem(M_elim);
      renderFailure(classification.title, classification.message);
      return;
    }

    // Perulangan substitusi mundur
    for (let i = N - 1; i >= 0; i--) {
      let sum = 0;
      let exprTerms = [];
      for (let j = i + 1; j < N; j++) {
        const contrib = M_elim[i][j] * X[j];
        sum += contrib;
        // Tampilkan tanda dengan benar (bukan selalu '+')
        const sign = contrib >= 0 ? '+' : '-';
        exprTerms.push(`${sign} (${formatNum(Math.abs(M_elim[i][j]))} × ${formatNum(X[j])})`);
      }

      X[i] = (M_elim[i][N] - sum) / M_elim[i][i];

      // Format penjelasan untuk langkah substitusi mundur
      let desc = `Menghitung nilai $x_{${i+1}}$ dari Baris ${i+1}:<br>`;
      
      // Bentuk persamaan: a[i][i]*x_{i+1} + ... = b[i]
      let mathExpr = `${formatNum(M_elim[i][i])} x_{${i+1}}`;
      if (exprTerms.length > 0) {
        mathExpr += ` ` + exprTerms.join(' ');
      }
      mathExpr += ` = ${formatNum(M_elim[i][N])}`;
      desc += `<span class="equation-text">$${mathExpr}$</span><br>`;
      
      // Bentuk penyelesaian: x_{i+1} = (b - sum) / a[i][i]
      let solveExpr = `x_{${i+1}} = \\frac{${formatNum(M_elim[i][N])}`;
      if (Math.abs(sum) > 1e-12) {
        // Tampilkan pengurangan sum dengan tanda yang benar
        const sumSign = sum > 0 ? '-' : '+';
        solveExpr += ` ${sumSign} ${formatNum(Math.abs(sum))}`;
      }
      solveExpr += `}{${formatNum(M_elim[i][i])}} = ${formatNum(X[i])}`;
      desc += `<span class="equation-text">$${solveExpr}$</span>`;

      logStep('backsub-step', desc, M_elim, {
        pivotRow: i,
        pivotCol: i,
        formula: `x_{${i+1}} = ${formatNum(X[i])}`
      });
    }

    // 3. Menampilkan hasil
    renderResults(X, steps);
  }

  // --- Fungsi Tampilan ---
  function renderFailure(title, message) {
    outputPlaceholder.style.display = 'flex';
    resultContent.style.display = 'none';
    
    outputPlaceholder.innerHTML = `
      <div class="placeholder-icon" style="color: var(--accent-danger); display: flex; justify-content: center; margin-bottom: 1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <h3>${title}</h3>
      <p>${message}</p>
    `;
  }

  function renderResults(X, steps) {
    outputPlaceholder.style.display = 'none';
    resultContent.style.display = 'block';

    // 1. Mengisi kartu hasil akhir variabel
    variablesResult.innerHTML = '';
    X.forEach((val, idx) => {
      const card = document.createElement('div');
      card.className = 'var-card';
      card.innerHTML = `
        <div class="var-name">x<sub>${idx + 1}</sub></div>
        <div class="var-value">${formatNum(val)}</div>
      `;
      variablesResult.appendChild(card);
    });

    // 2. Badge jumlah langkah
    stepCountBadge.textContent = `${steps.length - 1} Langkah`;

    // 3. Mengisi timeline langkah penyelesaian
    stepsTimeline.innerHTML = '';
    
    steps.forEach((step, idx) => {
      const stepItem = document.createElement('div');
      let stepClass = 'step-item';
      if (step.type === 'pivoting-step') stepClass += ' pivoting-step';
      if (step.type === 'elimination-step') stepClass += ' elimination-step';
      if (step.type === 'backsub-step') stepClass += ' backsub-step';
      stepItem.className = stepClass;

      // Judul langkah
      const stepHeader = document.createElement('h4');
      stepHeader.className = 'step-title';
      if (step.type === 'init') {
        stepHeader.textContent = 'Matriks Awal';
      } else if (step.type === 'backsub-step') {
        stepHeader.textContent = `Substitusi Mundur: Variabel x${step.pivotRow + 1}`;
      } else {
        stepHeader.textContent = `Langkah ${idx}: ${step.type === 'pivoting-step' ? 'Pivoting Baris' : 'Eliminasi Elemen'}`;
      }
      stepItem.appendChild(stepHeader);

      // Deskripsi langkah
      const stepDesc = document.createElement('p');
      stepDesc.className = 'step-description';
      stepDesc.innerHTML = formatLatexSimple(step.description);
      stepItem.appendChild(stepDesc);

      // Wadah visualisasi matriks
      const matrixWrapper = document.createElement('div');
      matrixWrapper.className = 'step-matrix-wrapper';

      const matrixGrid = document.createElement('div');
      matrixGrid.className = 'step-matrix';
      
      // Menampilkan matriks pada langkah ini
      step.matrixState.forEach((row, rIdx) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'step-matrix-row';
        
        // Menandai baris pivot atau baris target yang sedang diproses
        if (step.type === 'pivoting-step' && (rIdx === step.pivotRow || rIdx === step.swappedWith)) {
          rowDiv.classList.add('pivot-row');
        } else if (step.type === 'elimination-step' && rIdx === step.pivotRow) {
          rowDiv.classList.add('pivot-row');
        }

        row.forEach((val, cIdx) => {
          const cellDiv = document.createElement('div');
          cellDiv.className = 'step-cell';
          cellDiv.textContent = formatNum(val);

          // Penanda warna di dalam sel
          if (step.type === 'elimination-step') {
            if (rIdx === step.pivotRow && cIdx === step.pivotCol) {
              cellDiv.classList.add('active-pivot');
            } else if (rIdx === step.targetRow && cIdx === step.targetCol) {
              cellDiv.classList.add('target-cell');
            } else if (rIdx === step.targetRow && cIdx === step.pivotCol && Math.abs(val) < EPSILON) {
              cellDiv.classList.add('eliminated-zero');
            }
          } else if (step.type === 'pivoting-step') {
            if (rIdx === step.pivotRow && cIdx === step.pivotCol) {
              cellDiv.classList.add('active-pivot');
            }
          } else if (step.type === 'backsub-step') {
            if (rIdx === step.pivotRow && cIdx === step.pivotCol) {
              cellDiv.classList.add('active-pivot');
            }
          }

          rowDiv.appendChild(cellDiv);

          // Garis pemisah visual untuk kolom augmented
          if (cIdx === N - 1) {
            const stepSep = document.createElement('div');
            stepSep.className = 'augmented-separator';
            stepSep.style.height = '24px';
            rowDiv.appendChild(stepSep);
          }
        });

        matrixGrid.appendChild(rowDiv);
      });

      matrixWrapper.appendChild(matrixGrid);
      stepItem.appendChild(matrixWrapper);

      // Tampilan rumus operasi
      if (step.formula) {
        const formulaDiv = document.createElement('div');
        formulaDiv.className = 'step-formula-box';
        formulaDiv.innerHTML = formatLatexSimple(step.formula);
        stepItem.appendChild(formulaDiv);
      }

      stepsTimeline.appendChild(stepItem);
    });

    // Gulir otomatis ke bagian hasil
    document.getElementById('output-section').scrollIntoView({ behavior: 'smooth' });
  }

  // Memformat sebagian kecil sintaks mirip LaTeX yang dipakai di penjelasan langkah.
  function formatLatexSimple(text) {
    const formatted = text.replace(/\$([^\$]+)\$/g, (match, formula) => {
      return `<span style="font-family: var(--font-mono); font-weight: 600; color: #60a5fa;">${cleanMathSyntax(formula)}</span>`;
    });

    return cleanMathSyntax(formatted);
  }

  function cleanMathSyntax(formula) {
    return formula
      .replace(/\\frac{([^}]+)}{([^}]+)}/g, '(($1) / ($2))')
      .replace(/\s*\\times\s*/g, ' × ')
      .replace(/R_\{?(\d+)\}?/g, 'R$1')
      .replace(/x_\{?(\d+)\}?/g, 'x$1')
      .replace(/\\leftarrow/g, ' ← ')
      .replace(/\\leftrightarrow/g, ' ↔ ');
  }
});
