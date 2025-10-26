# Sample Solutions for Testing

## Problem 1: Two Sum

### Java Solution
```java
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] numsStr = sc.nextLine().split(" ");
        int target = Integer.parseInt(sc.nextLine());
        
        int[] nums = new int[numsStr.length];
        for (int i = 0; i < numsStr.length; i++) {
            nums[i] = Integer.parseInt(numsStr[i]);
        }
        
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                System.out.println(map.get(complement) + " " + i);
                return;
            }
            map.put(nums[i], i);
        }
        sc.close();
    }
}
```

### Python Solution
```python
nums = list(map(int, input().split()))
target = int(input())

seen = {}
for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:
        print(seen[complement], i)
        break
    seen[num] = i
```

### C++ Solution
```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
#include <sstream>
using namespace std;

int main() {
    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<int> nums;
    int num;
    while (iss >> num) {
        nums.push_back(num);
    }
    
    int target;
    cin >> target;
    
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.find(complement) != seen.end()) {
            cout << seen[complement] << " " << i << endl;
            return 0;
        }
        seen[nums[i]] = i;
    }
    
    return 0;
}
```

---

## Problem 2: Reverse String

### Java Solution
```java
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        String reversed = new StringBuilder(s).reverse().toString();
        System.out.println(reversed);
        sc.close();
    }
}
```

### Python Solution
```python
s = input()
print(s[::-1])
```

### C++ Solution
```cpp
#include <iostream>
#include <algorithm>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    reverse(s.begin(), s.end());
    cout << s << endl;
    return 0;
}
```

---

## Problem 3: Valid Parentheses

### Java Solution
```java
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) {
                    System.out.println("false");
                    return;
                }
                char top = stack.pop();
                if ((c == ')' && top != '(') ||
                    (c == '}' && top != '{') ||
                    (c == ']' && top != '[')) {
                    System.out.println("false");
                    return;
                }
            }
        }
        
        System.out.println(stack.isEmpty() ? "true" : "false");
        sc.close();
    }
}
```

### Python Solution
```python
s = input()
stack = []

for c in s:
    if c in '({[':
        stack.append(c)
    else:
        if not stack:
            print("false")
            exit()
        top = stack.pop()
        if (c == ')' and top != '(') or \
           (c == '}' and top != '{') or \
           (c == ']' and top != '['):
            print("false")
            exit()

print("true" if not stack else "false")
```

### C++ Solution
```cpp
#include <iostream>
#include <stack>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if (st.empty()) {
                cout << "false" << endl;
                return 0;
            }
            char top = st.top();
            st.pop();
            if ((c == ')' && top != '(') ||
                (c == '}' && top != '{') ||
                (c == ']' && top != '[')) {
                cout << "false" << endl;
                return 0;
            }
        }
    }
    
    cout << (st.empty() ? "true" : "false") << endl;
    return 0;
}
```

---

## Wrong Solutions (For Testing Error Cases)

### Wrong Answer Example
```java
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Always print 0 0 (wrong answer)
        System.out.println("0 0");
        sc.close();
    }
}
```

### Time Limit Exceeded Example
```java
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Infinite loop
        while (true) {
            // This will cause TLE
        }
    }
}
```

### Runtime Error Example
```java
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Null pointer exception
        String s = null;
        System.out.println(s.length());
        sc.close();
    }
}
```

### Compilation Error Example
```java
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Hello"  // Missing closing parenthesis
        sc.close();
    }
}
```

---

## Testing Checklist

✅ Test all 3 problems with correct solutions
✅ Test in all 3 languages (Java, Python, C++)
✅ Test wrong answer scenario
✅ Test time limit exceeded
✅ Test runtime error
✅ Test compilation error
✅ Verify leaderboard updates
✅ Verify confetti on acceptance
✅ Test with multiple users
✅ Verify problem solved checkmark

---

## Expected Results

### Correct Solutions
- Status: **ACCEPTED**
- Verdict: "Accepted! All test cases passed."
- Test Cases: X/X passed
- Confetti animation triggers
- Leaderboard updates with points
- Problem marked as solved (green checkmark)

### Wrong Answer
- Status: **WRONG_ANSWER**
- Verdict: "Wrong Answer on test case N"
- Test Cases: Shows how many passed before failure

### Time Limit Exceeded
- Status: **TLE**
- Verdict: "Time Limit Exceeded on test case N"

### Runtime Error
- Status: **RUNTIME_ERROR**
- Verdict: Shows error message

### Compilation Error
- Status: **COMPILATION_ERROR**
- Verdict: Shows compilation error details
