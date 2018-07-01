<template>
  <div class="wrapper">

    <div id="chatRoom" class="chatRoom">
      <div class="chatRoom__header">
        <i class="far fa-comment-dots"></i>
        <h3 class="title">聊天室</h3>

        <div class="fixIcon">
          <i class="fas fa-minus"></i>
          <i class="fas fa-times"></i>
        </div>
      </div>

      <div id="js-roomBody" class="chatRoom__body">
        <div class="messageBox"
          v-for="(item, index) in messages" :key="index">

          <div class="messageBox__avatar" v-if="item.userName != userName">
            <img src="https://lorempixel.com/output/animals-q-c-40-40-8.jpg" alt="">
          </div>

          <div class="messageBox__content"
            :class="{ 'self': item.userName === userName}">

            <div class="messageBox__content__name" v-if="item.userName != userName">
              {{ item.userName }}
            </div>
            <div class="messageBox__content__message"
              v-if="item.type == 'text'">
              {{ item.message }}
            </div>
            <div v-if="item.type == 'image'"
              class="messageBox__content__image">
              <img :src="item.message">
            </div>

          </div>

          <div class="messageBox__content__time">
              {{$moment(item.time).format("h:mm a")}}
            </div>
        </div>

        <div v-show="upload" class="upload">
          <div class="upload__progress">
            <div class="upload__progress--percent"
            :style="{width: `${progress}%`}"></div>
            <div class="upload__progress--number">{{progress}}</div>
          </div>
        </div>
      </div>

      <div class="chatRoom__footer">
        <div class="toolbar">
          <input type="file"
          @change="sendImage($event)"
          accept="image/*">
        </div>
        <textarea
          rows="5"
          v-model="inputMsg"
          @keyup.enter="sendMsg($event)">
        </textarea>
      </div>
    </div>

    <div is='ChatRoomFooter'></div>

  </div>
</template>

<script>
// import { mapState, mapGetters, mapMutations } from 'vuex';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import ChatRoomFooter from './ChatRoomFooter';

// eslint-disable-next-line
const msgRef = firebase.database().ref('/messages/');
// eslint-disable-next-line
const storageRef = firebase.storage().ref('/images/');

export default {
  name: 'ChatRoom',
  components: {
    FontAwesomeIcon,
    ChatRoomFooter
  },
  data() {
    return {
      userName: 'User',
      messages: [],
      inputMsg: '',
      upload: false,
      progress: ''
    };
  },
  methods: {
    sendMsg(e) {
      // 若按住shift，則代表輸入多行訊息
      if (e.shiftKey) {
        return;
      }

      // 如果輸入是空則不傳送訊息
      if (this.inputMsg.length <= 1 && this.inputMsg.trim() === '') {
        return;
      }

      // 儲存
      msgRef.push({
        userName: this.userName,
        type: 'text',
        message: this.inputMsg.trim(),
        time: this.$moment().format()
      });

      // 清空輸入欄位
      this.inputMsg = '';
    },
    sendImage(e) {
      const vm = this;
      const userName = this.userName;

      // 取得上傳檔案的資料
      const file = e.target.files[0];
      const fileName = `${Math.floor(Date.now() / 1000)}_${file.name}`;
      console.log(fileName);

      const metadata = {
        contentType: 'image/*'
      };

      // 上傳資訊設定
      storageRef.child(fileName).put(file, metadata);
      const uploadTask = storageRef.child(fileName).put(file, metadata);

      // 上傳狀態處理
      uploadTask.on(
        // eslint-disable-next-line
        firebase.storage.TaskEvent.STATE_CHANGED,
        // 上傳進度
        snapshot => {
          const progress = Math.floor(
            // eslint-disable-next-line
            snapshot.bytesTransferred / snapshot.totalBytes * 100
          );
          if (progress < 100) {
            // 開啟進度條
            vm.upload = true;
            vm.progress = `${progress}%`;
          }
        },
        // 錯誤處理
        error => {
          msgRef.child('bug/').push({
            userName,
            type: 'image',
            message: error.code,
            time: this.$moment().format()
          });
        },
        // 上傳結束
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log('File available at', downloadURL);

            msgRef.push({
              userName,
              type: 'image',
              message: downloadURL,
              time: this.$moment().format()
            });
          });

          // 關閉進度條
          vm.upload = false;
        }
      );
    }
  },
  mounted() {
    const vm = this;

    // firebase 使用 on 隨時監聽
    msgRef.on('value', snapshot => {
      const val = snapshot.val();
      vm.messages = val;
    });
  },
  updated() {
    // 當畫面渲染完成，將聊天視窗滾到最底部
    const roomBody = document.querySelector('#js-roomBody');
    roomBody.scrollTop = roomBody.scrollHeight;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lagn="scss">
</style>
