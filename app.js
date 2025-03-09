const { createApp, ref, nextTick } = Vue;
const { Plus, Delete } = ElementPlusIconsVue;

const app = createApp({
    setup() {
        let idCounter = 1000;

        // 樹狀結構數據
        const treeData = ref([]);
        const treeRef = ref(null);
        const generateUniqueId = () => Date.now() + Math.floor(Math.random() * 1000);

        // 用戶輸入的新根節點名稱
        const newRootLabel = ref("");

        const addRoot = () => {
          if (newRootLabel.value.trim() === "") {
            //   ElMessage.warning("請輸入根節點名稱");
              return;
          }
      
          treeData.value.push({ 
              id: generateUniqueId(), 
              label: newRootLabel.value, 
              checked: false, // ✅ 預設為 false
              children: [] 
          });
      
          console.log("目前的樹狀結構：", treeData.value);
          newRootLabel.value = ""; // 清空輸入框
      };

        // 新增子節點
        const addChild = (data) => {
          if (!data.children) {
              data.children = [];
          }
          data.children.push({ 
              id: generateUniqueId(), 
              label: `新節點 ${idCounter++}`, 
              checked: false, // ✅ 預設為 false
              children: [] 
          });
      };

        // 刪除節點
        const removeNode = (node, data) => {
            const parent = node.parent;
            if (!parent) return;
            const siblings = parent.data.children || parent.data;
            const index = siblings.findIndex(item => item.id === data.id);
            if (index !== -1) siblings.splice(index, 1);
        };

        const handleCheckChange = (data, checked) => {
          data.checked = checked; // ✅ 直接更新節點的 checked 屬性
          updateParentCheckedState(treeData.value); // 🔥 更新所有父節點的狀態
          console.log(`節點: ${data.label}, 狀態: ${checked ? "已選中" : "未選中"}`);
      };

    // const handleCheckChange = (data, checked) => {
    //     data.checked = checked;
    
    //     // 遞迴更新所有子節點的 checked 狀態
    //     const updateChildrenChecked = (node, checked) => {
    //         node.children.forEach(child => {
    //             child.checked = checked;
    //             updateChildrenChecked(child, checked);
    //         });
    //     };
    //     updateChildrenChecked(data, checked);
    
    //     // 遞迴更新父節點的狀態（確保半選中不會被視為全選）
    //     const updateParentCheckedState = (node) => {
    //         if (!node || !node.parent) return;
    //         const parent = node.parent;
            
    //         const allChecked = parent.children.every(child => child.checked);
    //         const someChecked = parent.children.some(child => child.checked);
            
    //         parent.checked = allChecked ? true : someChecked ? false : false;
    //         updateParentCheckedState(parent);
    //     };
    //     updateParentCheckedState(data);
    
    //     console.log(`節點更新: ${data.label}, 選擇狀態: ${data.checked}`);
    // };
    


      const updateParentCheckedState = (nodes) => {
        nodes.forEach(node => {
            if (node.children && node.children.length > 0) {
                updateParentCheckedState(node.children);
    
                // 檢查子節點的 checked 狀態
                const allChecked = node.children.every(child => child.checked);
                const someChecked = node.children.some(child => child.checked);
    
                // ✅ 如果所有子節點都選中，父節點也設為 true
                // ✅ 如果至少有一個子節點被選中，父節點應該是半選（但這裡我們用 true）
                node.checked = allChecked || someChecked;
            }
        });
    };

    //   const sendCheckedNodes = () => {
    //     console.log("完整的樹狀結構（含 checked 狀態）：", JSON.stringify(treeData.value, null, 2));
    
    //     alert(
    //         "完整的樹狀結構已輸出至控制台！\n" +
    //         "請打開開發者工具 (F12) -> Console 查看詳細數據。"
    //     );
    // };
    // const sendCheckedNodes = async () => {
    //     console.log("完整的樹狀結構（含 checked 狀態）：", JSON.stringify(treeData.value, null, 2));
    
    //     try {
    //         const response = await fetch("http://localhost:5000/save_tree_data", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(treeData.value) // 傳送 `treeData` 到後端
    //         });
    
    //         const result = await response.json();
    //         alert(result.message || "儲存失敗！");
    //     } catch (error) {
    //         console.error("儲存錯誤:", error);
    //         alert("儲存錯誤，請檢查伺服器狀態！");
    //     }
    // };

    // const sendCheckedNodes = async () => {
    //     console.log("🚀 完整的樹狀結構（含 checked 狀態）：", JSON.stringify(treeData.value, null, 2));
    
    //     try {
    //         const response = await fetch("http://localhost:5000/save_tree_data", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(treeData.value)  // 傳遞完整的 `treeData`
    //         });
    
    //         const result = await response.json();
    //         alert(result.message || "儲存失敗！");
    //     } catch (error) {
    //         console.error("❌ 儲存錯誤:", error);
    //         alert("❌ 儲存錯誤，請檢查伺服器狀態！");
    //     }
    // };
        // 🔹 取得所有 `checked` 為 `true` 的節點 ID
        const getCheckedKeys = (nodes) => {
            let keys = [];
            const traverse = (node) => {
                if (node.checked === true) keys.push(node.id);
                if (node.children) node.children.forEach(traverse);
            };
            nodes.forEach(traverse);
            return keys;
        };
        
          
          const findParent = (id) => {
            let parentNode = null;
            
            const searchTree = (nodes, parent = null) => {
                for (const node of nodes) {
                    if (node.id === id) {
                        parentNode = parent;
                        return;
                    }
                    if (node.children && node.children.length > 0) {
                        searchTree(node.children, node);
                    }
                }
            };
        
            searchTree(treeData.value);
            return parentNode;
        };
    

        const sendCheckedNodes = async () => {
          if (!treeRef.value) {
              console.error("treeRef 未綁定");
              return;
          }
      
          // ✅ 取得所有勾選 & 半選的節點 ID
          const checkedKeys = new Set(treeRef.value.getCheckedKeys(true));  
          console.log("所有勾選 & 半勾選的節點 ID:", [...checkedKeys]);
      
          if (checkedKeys.size === 0) {
              alert("沒有勾選任何節點");
              return;
          }
      
          // ✅ 遍歷整個樹，找到被勾選 & 其父節點
          const selectedNodes = [];
      
          const findCheckedNodes = (nodes, parent = null) => {
              nodes.forEach(node => {
                  // 如果節點在 checkedKeys 內，則選擇它
                  if (checkedKeys.has(node.id)) {
                      selectedNodes.push({
                          id: node.id,
                          label: node.label
                      });
      
                      // 🔥 手動加入父節點
                      while (parent) {
                          if (!selectedNodes.find(n => n.id === parent.id)) {
                              selectedNodes.push({
                                  id: parent.id,
                                  label: parent.label
                              });
                          }
                          parent = findParent(parent.id); // 逐層回溯父節點
                      }
                  }
      
                  // 遞歸處理子節點
                  if (node.children) {
                      findCheckedNodes(node.children, node);
                  }
              });
          };
      
          findCheckedNodes(treeData.value);
      
        //   console.log("完整的已勾選節點（包含父節點）：", selectedNodes);
        //   alert(
        //       "已勾選的節點（含父節點）：\n" +
        //       selectedNodes.map(node => `ID: ${node.id}, Label: ${node.label}`).join("\n")
        //   );
            console.log("🚀 完整的樹狀結構（含 checked 狀態）：", JSON.stringify(treeData.value, null, 2));
                    try {
                const response =  await fetch("http://localhost:5000/save_tree_data", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(treeData.value)  // 傳遞完整的 `treeData`
                });
        
                const result = await  response.json();
                alert(result.message || "儲存失敗！");
            } catch (error) {
                console.error("❌ 儲存錯誤:", error);
                alert("❌ 儲存錯誤，請檢查伺服器狀態！");
            }
        };
      
      const loadTreeData = async () => {
        try {
            const response = await fetch("http://localhost:5000/load_tree_data");
            if (!response.ok) throw new Error("無法載入樹狀結構");
    
            treeData.value = await response.json(); // 將後端回傳的 JSON 轉換為 `treeData`
            console.log("已載入的樹狀結構：", treeData.value);
        } catch (error) {
            console.error("載入錯誤:", error);
            alert("載入錯誤，請檢查伺服器狀態！");
        }
    };



    
      
      

        return {
          treeData,
          newRootLabel,
          addRoot,
          addChild,
          removeNode,
          sendCheckedNodes,  // ✅ 確保這裡有 return
          handleCheckChange,  // ✅ 確保這裡有 return
          loadTreeData,  // ✅ 加入這行，否則 Vue 無法在 template 使用
          treeRef, // ✅ 確保 ref 也 return
          
      };
    }
});

app.use(ElementPlus);
app.component("plus", Plus);
app.component("delete", Delete);
app.mount("#app");
