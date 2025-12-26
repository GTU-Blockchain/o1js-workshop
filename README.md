# 🧠 o1js Workshop – Zero-Knowledge Basics

This repository is prepared for learning the **core mental model of Zero-Knowledge (ZK) proofs** and the **o1js workflow**.

During this workshop:

-   We will not build large projects
-   We will not write UI / frontend
-   We will write and run **real ZK proofs**

Focus:

> **ZK mental model + how to think in o1js**

---

## 🎯 What You Will Do

In this workshop you will:

-   Understand public input vs private input (witness)
-   Learn what a constraint actually means
-   Use o1js to:
    -   compile
    -   prove
    -   verify
-   Build a minimal commitment proof
-   Mini challenge:  
    **Prove “I am at least 18 years old” without revealing your age**

---

## 🧩 ZK Flow (Short Summary)

Every ZK program in o1js follows this flow:

1. Write a ZkProgram
2. Compile the program
3. Generate a proof using private input
4. Verify the proof using public input

You will repeat this flow multiple times in this repository.

---

## 📦 Requirements

You should have the following installed:

-   Node.js (v18+ recommended)
-   npm
-   Git

Check with:

```bash
node -v
npm -v
git --version
```

## 🧰 zkApp CLI (zk) – Setup

⚠️ **Important:**

The CLI is NOT required to complete this workshop.
Everything can be done inside this repository.

The CLI is provided for those who want to experiment or create their own zkApps later.

### What is zkApp CLI?

The zkApp CLI (zk) is the official Mina tool used to:

-   scaffold zkApp projects
-   run tests
-   deploy zkApps

It automatically includes o1js.

### Install zkApp CLI

Install globally:

```bash
npm install -g zkapp-cli
```

Verify installation:

```bash
zk --version
```

If the command is not found:

-   restart your terminal
-   ensure your global npm bin path is in your $PATH

### Optional: Create a Sample zkApp

This step is optional and not required for the workshop.

```bash
zk project my-zkapp
cd my-zkapp
npm install
npm test
```

## 📚 Official Documentation

Recommended official resources:

-   [Mina Docs](https://docs.minaprotocol.com/)
-   [zkApp CLI installation](https://docs.minaprotocol.com/zkapps/writing-a-zkapp/introduction-to-zkapps/install-zkapp-cli)
-   [Getting started with zkApps](https://docs.minaprotocol.com/zkapps/writing-a-zkapp/introduction-to-zkapps/getting-started-zkapps)
-   [How zkApps work](https://docs.minaprotocol.com/zkapps/writing-a-zkapp/introduction-to-zkapps/how-zkapps-work)
-   [o1js documentation](https://docs.minaprotocol.com/zkapps/o1js)

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/GTU-Blockchain/o1js-workshop
cd o1js-workshop
npm install
npm test
```

If tests run successfully, you are ready.

## 🧪 Workshop Steps

### Mini Challenge: Age ≥ 18

**Goal:**

Prove that you are at least 18 years old without revealing your age.

**Rules:**

-   Age must be a private input
-   The constraint must enforce age >= 18
-   Test both valid and invalid cases

## 📤 How to Submit Your Work

### Recommended: Fork + Pull Request

1. Fork this repository

2. Create a new branch:

    ```bash
    git checkout -b submit/<your-name>
    ```

3. Commit your changes:

    ```bash
    git add .
    git commit -m "Complete workshop steps"
    ```

4. Push your branch:

    ```bash
    git push origin submit/<your-name>
    ```

5. Open a Pull Request to the original repository

    **PR title:**

    ```
    [Submission] Your Name
    ```

### Alternative: Patch File Submission

If you do not want to fork:

```bash
git diff > your-name.patch
```

Share the `.patch` file through the workshop channel.

## 🧠 Important Notes

-   ZK code is not runtime logic
-   `assertEquals`, `assertLessThan` define constraints
-   JavaScript `if` is not the same as `Provable.if`
-   Everything is about defining what must be true

## 🧠 Closing

Zero-Knowledge is not about hiding data,
it is about proving correctness while staying private.

o1js is the tool that turns this idea into working code.
